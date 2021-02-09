import axios, { AxiosError, AxiosInstance } from 'axios'
import { get } from 'lodash'
import ResponseError from 'modules/Response/ResponseError'

const AXIOS_TIMEOUT = process.env.AXIOS_TIMEOUT || 5000

function createAxios(baseURL: string): AxiosInstance {
  const instanceAxios = axios.create({
    baseURL,
    timeout: Number(AXIOS_TIMEOUT),
  })

  instanceAxios.interceptors.request.use((config) => {
    const curConfig = { ...config }

    // ALWAYS READ UPDATED TOKEN
    try {
      curConfig.headers.Authorization = localStorage.getItem('token')
    } catch (e) {
      console.log(e)
    }
    return curConfig
  })

  instanceAxios.interceptors.response.use(
    function onSuccess(response) {
      return response
    },
    function onError(error: AxiosError) {
      const statusCode = get(error, 'response.status', null)
      const message = get(error, 'response.data.message', null)

      if (statusCode === 401) {
        console.log('Unauhtorized')
        throw new ResponseError.Unauthorized(message)
      }

      if (statusCode === 400) {
        console.log('Bad Request')
        throw new ResponseError.BadRequest(message)
      }

      if (statusCode === 404) {
        console.log('Not Found')
        throw new ResponseError.NotFound(message)
      }

      const handleError = error?.response?.headers?.handleError
      if (!handleError || !handleError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new ResponseError.InternalServer('service unavailable')
        }

        console.log(error.message)
        throw new ResponseError.BadRequest(error.message)
      }
      return Promise.reject(error)
    }
  )

  return instanceAxios
}

class FetchApi {
  private axiosDefault: AxiosInstance

  private baseUri: string

  constructor(baseUri: string) {
    // @ts-ignore
    this.axiosDefault = null
    this.baseUri = baseUri
  }

  /**
   * axios instance default
   */
  get api(): AxiosInstance {
    if (!this.axiosDefault) {
      this.axiosDefault = createAxios(this.baseUri)
      return this.axiosDefault
    }

    return this.axiosDefault
  }
}

export default FetchApi
