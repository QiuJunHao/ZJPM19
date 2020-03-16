import Vue from 'vue';
import { Form } from 'element-ui';

Vue.component('zj-form', {
    mixins: [Form],
    props: {
        newDataFlag: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        newDataFlag: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.comparativeData = JSON.parse(JSON.stringify(this.model));
                }
            }
        },
        // model: {
        //     deep: true,
        //     immediate: true,
        //     handler(val, oldval) {
        //         this.getUpdateColumns();
        //     }
        // }
    },
    data() {
        return {
            comparativeData: [],
            updateColumns: null,
        }
    },
    computed:{
        UpdateColumns:{
            get:function(){
                return this.getUpdateColumns();
            }
        }
    },
    methods: {
        getUpdateColumns() {
            this.updateColumns = [];
            Object.keys(this.comparativeData).forEach(key => {
                if (key == 'children') return;
                if (key == 'UpdateColumns') return;
                if (this.model[key] != this.comparativeData[key]) {
                    this.updateColumns.push(key);
                }
            });
            return this.updateColumns;
        }
    },
    mounted(){
        //this.comparativeData = JSON.parse(JSON.stringify(this.model));
    }
})