<template>
    <div class="store-select">
            <v-select
                    :items="storeList"
                    v-model="storeId"
                    item-text="name"
                    item-value="id"
                    label="未添加门店"
                    @change="changeStore"
                    persistent-hint
                    return-object
                    single-line
            ></v-select>
    </div>
</template>

<script>
    import $http from  '../../plugins/axios'
    export default {
        data: () => ({
            storeList: [],
            storeId:0
        }),
        mounted(){
            this.getStoreData();
        },
        methods:{
            changeStore(storeObj){
                this.$emit('changeStore',storeObj?storeObj.id:null)
            },
            setStoreData(obj){
                this.$emit('setStoreData',obj)
            },
            getData(){
                this.$emit('getData')
            },
            getStoreData(){
                $http.get('/auth/store_list').then(res => {
                    console.log('store:',res)
                    this.storeId=res.data[res.data.length-1].id;
                    this.storeList=res.data;
                    this.changeStore(res.data[res.data.length-1]);
                    this.setStoreData(res.data)
                })
            }
        }
    }
</script>

<style>
    .store-select{text-align: right;position: fixed;z-index: 11;top:5px; left: 10px;}
    .store-select .v-input { margin:0 20px; display: inline-block; width: 200px;}

</style>
