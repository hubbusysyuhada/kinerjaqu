import asyncAxios from 'axios'

// const baseURL = 'https://kinerjaqu.herokuapp.com/'
const baseURL = 'http://localhost:3000'

export default asyncAxios.create({
    baseURL
})