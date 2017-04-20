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
        $.ajax({
          url: apiURL,
          type: 'GET',
          context: this,
          dataType: 'json',
          async: false,
          success: function(data) {
            console.log(data)
            this.certs = data.certs
          },
          error: function(err) {
            alert(console.log(err))
          }
        })
      },
      postData: function(){
        $.ajax({
          url: apiURL,
          type: 'POST',
          data: toPost,
          success: function() {
            console.log("posted")
            vm.fetchData()
          },
          error: function (xhr, ErrorText, thrownError) {
                console.log('ErrorText: ' + ErrorText + "\n")
                console.log('thrownError: ' + thrownError + "\n")
                console.log('xhr status: ' + xhr.status)
                console.log('xhr responseText: ' + xhr.responseText)
          },
          dataType: "json",
          contentType: "application/json"
        })
      },
      removeData: function(){
        const sign = window.prompt('which id to remove')
        $.ajax({
            url: apiURL + '/' + sign,
            type: 'DELETE',
            data: toPost,
            traditional:true,
            dataType: 'json',
            success: function() {
               console.log("deleted!")
               vm.fetchData()
            },
            error: function(err) {
              alert(console.log(err))
            }
        })
      },
      submitForm: function() {
        console.log('submitting new cert..')
        $.ajax({
          url: apiURL,
          type: 'POST',
          data: JSON.stringify({
            file_name: this.filename,
            path: '/home/mmorgan/client-configs/files/' + this.filename,
            creation_time: timeStamp(),
            active : false,
            last_login: ''
          }),
          success: function() {
            console.log("cert submitted")
            vm.fetchData()
            vm.filename = ''
          },
          error: function(xhr, ErrorText, thrownError) {
            console.log(this.data)
            console.log('ErrorText: ' + ErrorText + "\n")
            console.log('thrownError: ' + thrownError + "\n")
            console.log('xhr status: ' + xhr.status)
            console.log('xhr responseText: ' + xhr.responseText)
          },
            dataType: "json",
            contentType: "application/json"
        })
      },
      sortBy: function(sortKey) {
        console.log(`sortting ${sortKey}`)
        vm.certs = vm.certs.sort(function(a,b) {
          return (a[sortKey] > b[sortKey])
        })
      }
  }
})
