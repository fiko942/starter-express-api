const axios = require('axios')
const FormData = require('form-data')

!(async() => {
    const fd = new FormData()
    fd.append('email', 'haha@gmail.com')
    const url = 'https://arizpedia.com/subscription/process'
    const data = (await axios.post(url, fd, {
        headers: fd.getHeaders()
    })).data
    console.log(data)
})()