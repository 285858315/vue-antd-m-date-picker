<template>
    <div>
        <template v-if="mode == 'datetime'">
            <Picker
                style="float:left;"
                v-for="(item,key) in list"
                @updateValue="updateValue(item,$event)"
                :style="{width:100 / list.length + '%'}"
                :list="item.list"
                :key="key"
                :value="item.value" />
        </template>
    </div>
</template>

<script>
    import Moment from "moment"
    import Picker from "vue-antd-m-picker"
    import {TimeType} from "./Type.ts"

    export default {
        props:{
            mode:{
                type:String,
                default:"date"
            },
            value:String,
            minDate:String,
            maxDate:String,
            title:String
        },
        components:{
            Picker
        },
        data(){
            return {
                list:[],
            }
        },
        created(){
            this.init()
        },        
        watch:{
            value(a,b){     
                this.init()
            }
        },
        computed:{
            is_min_m(){
                return this.value && this.minDate1.year() == this.value1.year() && this.minDate1.month() == this.value1.month()
            },
            is_max_m(){
                return this.value && this.maxDate1.year() == this.value1.year() && this.maxDate1.month() == this.value1.month()
            },
            is_min_d(){
                return this.is_min_m && this.minDate1.date() == this.value1.date()
            },
            is_max_d(){
                return this.is_max_m && this.maxDate1.date() == this.value1.date()
            },
            is_min_h(){
                return this.is_min_d && this.minDate1.hours() == this.value1.hours()
            },
            is_max_h(){
                return this.is_max_d && this.maxDate1.hours() == this.value1.hours()
            },
            is_min_m1(){
                return this.is_min_h && this.minDate1.minutes() == this.value1.minutes()
            },
            is_max_m1(){
                return this.is_max_h && this.maxDate1.minutes() == this.value1.minutes()
            }
        },
        methods:{
            init(){
                this.value1 = Moment(this.value)
                this.minDate1 = this.minDate1 || Moment(this.minDate)
                this.maxDate1 = this.maxDate1 || Moment(this.maxDate)
                if(this.value1 < this.minDate1){
                    this.$emit("updateValue",this.minDate1.format("YYYY-MM-DD HH:mm:ss"))
                    return
                }
                if(this.value1 > this.maxDate1){
                    this.$emit("updateValue",this.maxDate1.format("YYYY-MM-DD HH:mm:ss"))
                    return
                }
                this.onChange()
            },
            updateValue(item,value){
                this.value1[TimeType[item.type]](value)
                this.$emit("updateValue",this.value1.format("YYYY-MM-DD HH:mm:ss"))
            },
            onChange(){
                this.list = []
                switch(this.mode){
                    case "datetime":
                        this.list.push(this.getItem(TimeType.year))
                        this.list.push(this.getItem(TimeType.month))
                        this.list.push(this.getItem(TimeType.date))
                        this.list.push(this.getItem(TimeType.hours))
                        this.list.push(this.getItem(TimeType.minutes))
                        this.list.push(this.getItem(TimeType.seconds))
                        break;
                }
            },
            getItem(type){
                let res = {
                    list:[],
                    type:type,
                }
                let min,max,label
                switch(type){
                    case TimeType.year:
                        res.value = this.value1.year()
                        label = "年"
                        min = this.minDate1.year()
                        max = this.maxDate1.year()
                        break;
                    case TimeType.month:
                        res.value = this.value1.month()
                        label = "月"
                        min = 0
                        if(this.minDate1.year() == this.value1.year()){
                            min = this.minDate1.month()
                        }
                        max = 11
                        if(this.maxDate1.year() == this.value1.year()){
                            max = this.maxDate1.month()
                        }
                        break;
                    case TimeType.date:
                        res.value = this.value1.date()
                        label = "日"
                        min = 1
                        if(this.is_min_m){
                            min = this.minDate1.date()
                        }
                        max = this.value1.daysInMonth()
                        if(this.is_max_m){
                            max = this.maxDate1.date()
                        }
                        break;
                    case TimeType.hours:
                        res.value = this.value1.hours()
                        label = "时"
                        min = 0
                        if(this.is_min_d){
                            min = this.minDate1.hours()
                        }
                        max = 23
                        if(this.is_max_d){
                            max = this.maxDate1.hours()
                        }
                        break;
                    case TimeType.minutes:
                        res.value = this.value1.minutes()
                        label = "分"
                        min = 0
                        if(this.is_min_h){
                            min = this.minDate1.minutes()
                        }
                        max = 59
                        if(this.is_max_h){
                            max = this.maxDate1.minutes()
                        }
                        break;
                    case TimeType.seconds:
                        res.value = this.value1.seconds()
                        label = "秒"
                        min = 0
                        if(this.is_min_m1){
                            min = this.minDate1.seconds()
                        }
                        max = 59
                        if(this.is_max_h){
                            max = this.maxDate1.seconds()
                        }
                        break;                    
                }
                let _label
                for(let i = min; i <= max; i++){
                    _label = i + label
                    if(type == TimeType.month){
                        _label = (i + 1) + label
                    }
                    res.list.push({
                        value:i,
                        label:_label
                    })
                }
                return res
            }
        }            
    }
</script>