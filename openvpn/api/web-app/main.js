const apiURL = 'http://10.8.0.1:5000/ovpn/api/v1.0/active_certs'

// test post content
const toPost = JSON.stringify({
    "file_name" : "test2",
    "path" : "test",
    "creation_time" : "test",
    "active" : "False",
    "last_login" : ""
})

function timeStamp() {
  const now = new Date()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let year = now.getFullYear()
  let hours = now.getHours()
	let minutes = now.getMinutes()
  let seconds = now.getSeconds()

	if (hours < 10) hours = `0${hours}`
	if (minutes < 10) minutes = `0${minutes}`
  if (seconds < 10) seconds = `0${minutes}`
  if (month < 10) month = `0${month}`
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
}

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText)
  }
    return res
}

var vm = new Vue({
    el: '#entry',
    data: {
      certs:[],
      filename: '',
      sortKey: 'id',
      columns: ['id','active','creation_time','file_name','last_login','path']
    },
    created: function() {
      console.log('ready')
      this.fetchData()
    },
    methods: {
      fetchData: function(){
        fetch(apiURL, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(res => {
            console.log(`fetching ...\n ${JSON.stringify(res.certs)}`)
            vm.certs = res.certs
          })
          .catch(error => console.log(error))
      },
      postData: function(){
        fetch(apiURL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: toPost,
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(res => {
            console.log(`posting ...\n ${JSON.stringify(res)}`)
            vm.fetchData()
          })
          .catch(error => console.log(error))
      },
      removeData: function(){
        const sign = window.prompt('which id to remove')
        fetch(apiURL + '/' + sign, {
          method: 'DELETE',
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(res => {
            console.log(`deleting ...\n ${JSON.stringify(res)}`)
            vm.fetchData()
          })
          .catch(error => console.log(error))
      },
      submitForm: function() {
        console.log('submitting new cert..')
        fetch(apiURL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            file_name: this.filename,
            path: '/home/mmorgan/client-configs/files/' + this.filename,
            creation_time: timeStamp(),
            active : false,
            last_login: ''
          })
        })
          .then(handleErrors)
          .then(res => res.json())
          .then(res => {
            console.log(`posting ...\n ${JSON.stringify(res)}`)
            vm.fetchData()
          })
          .catch(error => console.log(error))
      },
      sortBy: function(sortKey) {
        console.log(`sortting ${sortKey}`)
        vm.certs = vm.certs.sort(function(a,b) {
          return (a[sortKey] > b[sortKey])
        })
      }
  }
})
