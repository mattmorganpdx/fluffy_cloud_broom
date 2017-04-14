const apiURL = 'http://10.8.0.1:5000/ovpn/api/v1.0/active_certs'

// test post content
const toPost = JSON.stringify({
    "file_name" : "test2",
    "path" : "test",
    "creation_time" : "test",
    "active" : "False",
    "last_login" : ""
})

var vm = new Vue({
    el: '#entry',
    data: {
      certs:[]
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
          error: function(xhr, err) {
            console.log(err)
            console.log('xhr status: ' + xhr.status)
            console.log('xhr responseText: ' + xhr.responseText)
          }
        })
      },
      postData: function(){
        $.ajax({
          type: 'POST',
          url: apiURL,
          data: toPost,
          success: function() {
            console.log("posted")
            vm.fetchData()
          },
          error: function(xhr, err) {
                console.log(err)
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
            error: function(xhr, err) {
                  console.log(err)
                  console.log('xhr status: ' + xhr.status)
                  console.log('xhr responseText: ' + xhr.responseText)
            }
        })
      }
    }
})
