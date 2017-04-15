import Vue from "vue"
import DatePicker from "./DatePicker.vue"
import Moment from "moment"
import "normalize.css"

const minDate = "2015-08-15 12:12:12"
const maxDate = "2018-01-01 23:59:59"
const now = "2015-08-16 13:13:00"
const App = new Vue({    
    template:require("./demo.html"),
    data(){
        return {
            list:["datetime","date","time","month","year"],
            mode:"datetime",
            minDate:minDate,
            maxDate:maxDate,
            value:now,
        }
    },
    components:{
        DatePicker
    },
    methods:{
        updateValue(a){
            console.log("updateValue",a)
            this.value = a
        }
    }
})
App.$mount("#app")
window.app = App
window.moment = Moment
