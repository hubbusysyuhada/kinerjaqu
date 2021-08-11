import asyncAxios from 'axios'

const baseURL = 'http://localhost:3000'

export default asyncAxios.create({
    baseURL
})