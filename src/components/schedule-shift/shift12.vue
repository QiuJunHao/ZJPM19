

<template>
  <div class="shift_group">
      <!-- 主表 shift_group  -->
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input @keyup.enter.native="refreshData" placeholder="请输入班次名称" v-model="condition" clearable style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewWorkPost()">新增班次</el-button>
        <!-- <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中标记类型({{selection.length}}) -->
        <!-- </el-button> -->
       
      </div>
      <!--  shift_group 注意事项该标记是作用于任务
// 标记类型ID	sg_id	int			TRUE	FALSE	TRUE
// 标记类型名称	sg_name	varchar(30)	30		FALSE	FALSE	FALSE
// 标记类型说明	sg_note	varchar(100)	100		FALSE	FALSE	FALSE
// c_id	c_id	int			FALSE	FALSE	TRUE
// update_date	update_date	datetime			FALSE	FALSE	FALSE
// update_user	update_user	int			FALSE	FALSE	FALSE
// create_date	create_date	datetime			FALSE	FALSE	FALSE
// create_user	create_user	int			FALSE	FALSE	FALSE -->
      <div class="topContent">
        <el-table ref="tgtTable" style="width: 100%;height:350px;" :data="sgData" tooltip-effect="dark"
          highlight-current-row row-key="sg_id" default-expand-all @selection-change="handleSelectionChange"
       @row-click="handleRowClick">
          <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
          <el-table-column prop="sg_id" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="sg_name" label="班次名称" align="center" width="150"></el-table-column>
          
          <el-table-column prop="sg_note" label="班次说明" align="center" width="180"></el-table-column>
          
          <el-table-column label="操作" width="150" prop="handle" center>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="onDeleteClick(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
     <!-- 主表新增修改 -->
    <el-dialog width="500px" :title="addSgText" :close-on-click-modal="false" :visible.sync="addsgVisiable"
      top="5vh" @closed="refreshForm">
      <zj-form :model="sgModel" :newDataFlag='addsgVisiable' label-width="100px" ref="sgForm"  :rules="add_rules">
        <!-- <el-form-item label="序号">
          <el-input class="formItem" v-model="sgModel.sg_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item> -->
        <el-form-item label="班次名称" prop="sg_name">
          <el-input class="formItem" v-model="sgModel.sg_name" placeholder="请填写标记类型名称">
          </el-input>
        </el-form-item>
        <el-form-item label="班次说明" prop="sg_note">
          <el-input class="formItem" type="textarea" :rows="2" v-model="sgModel.sg_note" placeholder="说明信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addsgVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSaveSgClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
       <!-- 明细内容 -->
           <div class="bottomLayout" style="min-height:300px;">
        <el-tabs v-model="activeName">
           <!-- 班次表
班次ID	ds_id	int			TRUE	FALSE	TRUE
班次组ID	sg_id	int			FALSE	TRUE	FALSE
班次名称(早中晚)	ds_name	varchar(30)	30		FALSE	FALSE	FALSE
班次说明	ds_note	varchar(100)	100		FALSE	FALSE	FALSE
开始时间(8:00)	ds_starttime	datetime			FALSE	FALSE	TRUE
结束时间(11:00)	ds_endtime	datetime			FALSE	FALSE	TRUE
是否报工	is_report	int			FALSE	FALSE	FALSE
时长	ds_period	numeric(2,2)	2	2	FALSE	FALSE	TRUE -->
          <el-tab-pane label="班次明细" name="first">
            <div v-if="bottomDataShow">
              <div class="tbar">
                <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button>
                <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称"
                  v-model="itemCondition" clearable style="width:250px;">
                  <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
                <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewShiftItemShow">新增班次
                </el-button>
                <el-button type="danger" size="small" :disabled="itemSelection.length==0" @click="deleteListItem">
                  删除选中班次({{itemSelection.length}})
                </el-button>
              </div>
              <div class="gridTable">
                <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="250" :data="taskItemData"
                  tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange2">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column type="index" width="40" align="center">
                  </el-table-column>
                  <el-table-column prop="ds_id" label="班次ID" align="center" width="200"></el-table-column>
                  <el-table-column prop="ds_name" label="班次名称" align="center" width="130"></el-table-column>
                   <el-table-column prop="ds_starttime" label="开始时间" align="center" width="130"></el-table-column>
                    <el-table-column prop="ds_endtime" label="结束时间" align="center" width="130"></el-table-column>
                     <el-table-column prop="is_report" label="是否报工" align="center" width="130"></el-table-column>
                       <el-table-column prop="ds_period" label="时长" align="center" width="130"></el-table-column>
                  
                  <el-table-column label="操作" width="140" prop="handle">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItemShow(scope.row)">
                      </el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" circle
                        @click="deleteOneItem(scope.row)">
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        
        </el-tabs>
      </div>
  </div>
</template>

<script>
export default {
  name: "shift_group",
  data() {
    return {
      condition: "",
      bottomDataShow:false,
      sgData: [], //表格数据
      day_shiftData:[],
      itemCondition:"",
      //deptDataFilter:[],
      //deptData: [], //部门数据
      selection: [],
       activeName: "first",
      addsgVisiable: false,
      sgModel: {},
      addOrNot: true, //是否新增
      addSgText: "",
       taskItemModelList: [],
  add_rules: {
       
        sg_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }],
       
      }
    };
  },

  // watch: {
  //   addsgVisiable(val) {
  //     if (val) {
  //       this.selectDept();
  //     }
  //   }
  // },
  methods: {



    refreshData() {
      this.z_get("api/shift_group", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.sgData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.sgForm.resetFields();
    },
    refreshBottom() {
      this.itemCondition = "";
      this.dataCondition = "";
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
       searchItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
     //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载tab数据
        this.refreshBottom();
        this.refreshItemData();
      
      }
      this.bottomDataShow = true;
    },
    //刷新班次
    refreshItemData() {
      this.loading = true;
      this.taskItemData = [];
      this.z_get(
        "api/day_shift",
        { st_id: this.currentRow.st_id, condition: this.itemCondition },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.taskItemData = res.data;
        })
        .catch(res => {});
    },
  //显示新增物料需求
    addNewShiftItemShow() {
      this.taskItemModelList = [];
      this.searchItemList();
      this.addOrNot = true;
      this.addTaskItemVisible = true;
    },
    //保存/编辑选中物料
    onSaveTaskItemClick() {
      this.$refs.taskItemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            //新增
            this.taskItemModelList.push(
              JSON.parse(JSON.stringify(this.taskItemModel))
            );
            this.selectItemVisible = false;
          } else {
            //修改
            this.taskItemModel.UpdateColumns = this.$refs.taskItemForm.UpdateColumns;
            if (this.taskItemModel.UpdateColumns) {
              this.z_put("api/standard_task_item", this.taskItemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshItemData();
                  this.selectItemVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.selectItemVisible = false;
            }
          }
        }
      });
    },
    //保存新增物料需求
    onSaveItemListClick() {
      if (this.taskItemModelList.length > 0) {
        for (var i = 0; i < this.taskItemModelList.length; i++) {
          if (!this.taskItemModelList[i].sti_quantity) {
            this.$alert("物料" + (i + 1) + "数量未填写", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
            return;
          }
        }
        this.z_post("api/standard_task_item/list", this.taskItemModelList)
          .then(res => {
            this.$message({
              message: "新增成功!",
              type: "success",
              duration: 1000
            });
            this.addTaskItemVisible = false;
            this.refreshItemData();
          })
          .catch(res => {
            this.$alert("新增失败!", "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      } else {
        this.$alert("为选中任何物料!", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },
    //显示编辑物料需求
    editItemShow(row) {
      this.taskItemModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addTaskItemText = "编辑物料需求";
      this.selectItemVisible = true;
    },
    //删除一个物料需求
    deleteOneItem(row) {
      var list = [];
      list.push(row);
      this.onDeleteItemClick(list);
    },
    //删除多个物料需求
    deleteListItem() {
      if (this.itemSelection.length) {
        this.onDeleteItemClick(this.itemSelection);
      }
    },
    //确认删除物料需求
    onDeleteItemClick(list) {
      this.$confirm("是否删除物料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/standard_task_item/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshItemData();
            })
            .catch(res => {
              this.$alert("删除失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },


    onSaveSgClick() {
      this.$refs.sgForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/shift_group", this.sgModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addsgVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
                 this.sgModel.UpdateColumns = this.$refs.sgForm.UpdateColumns;
            this.z_put("api/shift_group", this.sgModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addsgVisiable = false;
              })
              .catch(res => {
                this.$alert("编辑失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          }
        } else {
          return false;
        }
      });
    },
    //编辑数据
    editShow(row) {
      this.sgModel = JSON.parse(JSON.stringify(row));
      //this.sgModel.sg_id = this.filterDeptName(this.sgModel.dept_id);

      this.addSgText = "编辑标记类型";
      this.addOrNot = false;
      this.addsgVisiable = true;
    },
    //删除一个
  
 
 
onDeleteClick(row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/shift_group", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败", "不能删除已经使用的班次！", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },


    //多维数组扁平化
    arrayChildrenFlatten(array, result) {
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item.children && item.children.length > 0) {
          result.push(item);
          result = this.arrayChildrenFlatten(item.children, result);
        } else {
          result.push(item);
        }
      }
      return result;
    },
 
  

  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.shift_group {
  width: 100%;
}
.tbar {
  margin-bottom: 10px;
}
.formItem {
  width: 300px;
}
</style>