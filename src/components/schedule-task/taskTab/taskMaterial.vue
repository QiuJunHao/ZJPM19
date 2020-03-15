<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchTaskItem"></el-button>
      <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称" v-model="itemCondition"
        clearable style="width:250px;">
        <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;">新增物料需求
      </el-button>
      <el-button type="danger" size="small" :disabled="itemSelection.length==0">
        删除选中物料({{itemSelection.length}})
      </el-button>
    </div>
    <div class="gridTable" style="width:75%;">
      <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="200" :data="taskItemData"
        tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="55" align="center">
        </el-table-column>
        <el-table-column prop="item_name" label="物料名称" align="center" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="item_no" label="物料编码" align="center" width="150"></el-table-column>
        <el-table-column prop="ti_quantity" label="数量" align="center" width="100"></el-table-column>
        <el-table-column prop="item_unit" label="单位" align="center" width="100"></el-table-column>
        <el-table-column prop="ti_note" label="任务备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="140" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItemShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneItem(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentRow"],
  data() {
    return {
      itemCondition: "", //任务物料需求搜索的关键字
      itemListCondition: "", //物料主文件搜索的关键字
      itemSelection: [], //选中的任务物料需求记录集合
      loading: false,
      taskItemData:[],//任务物料需求记录表数据
            currentPage: 1,//当前页（物料主文件）
    };
  },
  watch: {
    // currentRow: {
    //   deep: true,
    //   immediate: true,
    //   handler() {
    //     this.searchTaskItem();
    //   }
    // }
  },
  methods: {
    //刷新任务物料需求
    refreshItemData() {
      this.loading = true;
      this.taskItemData = [];
      this.z_get(
        "api/task_item",
        {
          st_id: this.currentRow.st_id,
          tt_no: this.currentRow.tt_no,
          condition: this.itemCondition,
          source: this.source
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.taskItemData = res.data;
        })
        .catch(res => {});
    },
    //刷新物料item表（物料主文件）
    refreshItemListData() {
      this.loading2 = true;
      this.itemListData = [];
      this.z_get(
        "api/item/page",
        {
          condition: this.itemListCondition,
          page: this.currentPage,
          limit: this.limit
        },
        { loading: false }
      )
        .then(res => {
          this.loading2 = false;
          this.itemListData = res.data;
          this.total = res.total;
        })
        .catch(res => {});
    },
    //查询任务物料需求
    searchTaskItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    //查询物料item表（物料主文件）
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
      this.refreshItemListData();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.itemSelection = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshItemListData();
    },
    //弹出编辑任务物料需求记录的框体
    editItemShow(){

    },
    //删除一条任务物料需求记录
    deleteOneItem(){

    },
  }
};
</script>

<style scoped>