<template>
  <div class="shift_group">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshHead" placeholder="请输入班次名称" v-model="condition" clearable
            style="width:250px;">
            <el-button size="small" @click="refreshHead" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskShow">新增班次组
          </el-button>
         
         
         
        </div>
        <div class="gridTable">
          <el-table ref="shiftGroupTable" style="width: 100%;" height="250px" :data="taskData" tooltip-effect="dark"
            highlight-current-row row-key="st_id" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="st_id" label="任务编号" align="center" width="150"></el-table-column> -->
           <el-table-column prop="sg_id" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="sg_name" label="班次名称" align="center" width="150"></el-table-column>
          <el-table-column prop="sg_note" label="班次说明" align="center" width="180"></el-table-column>
            <el-table-column label="操作" width="140" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="onDeleteClick(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomLayout" style="min-height:300px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="班次明细" name="first">
            <div v-if="bottomDataShow">
              <div class="tbar">
                <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button>
                <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称"
                  v-model="itemCondition" clearable style="width:250px;">
                  <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
                <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewDayShiftShow">新增班次明细
                </el-button>
                <el-button type="danger" size="small" :disabled="itemSelection.length==0" @click="deleteListItem">
                  删除选中物料({{itemSelection.length}})
                </el-button>
              </div>
              <div class="gridTable">
                <el-table ref="DayShiftTable" v-loading="loading" style="width:100%;" height="250" :data="DayShiftData"
                  tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange2">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column type="index" width="40" align="center">
                  </el-table-column>
                 
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

    <!-- 新增/修改班次组 -->
    <el-dialog v-if="addTaskVisiable" v-dialogDrag width="450px" :title="addTaskText" :close-on-click-modal="false"
      :visible.sync="addTaskVisiable">
      <zj-form size="small" :newDataFlag='addTaskVisiable' :model="shiftGroupModel" label-width="100px" ref="taskForm"
        :rules="add_rules">
        <el-form-item label="班次名称" prop="sg_name">
          <el-input class="formItem" v-model="shiftGroupModel.sg_name" placeholder="请填写标记类型名称">
          </el-input>
        </el-form-item>
        <el-form-item label="班次说明" prop="sg_note">
          <el-input class="formItem" type="textarea" :rows="2" v-model="shiftGroupModel.sg_note" placeholder="说明信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 新增班次明细 -->
    <el-dialog :width=" DayShiftModelList.length? '1000px':'550px'" title="新增班次明细" :close-on-click-modal="false"
      :visible.sync="addDayShiftVisible">
       <zj-form size="small" :newDataFlag='addDayShiftVisible' :model="DayShiftModel" label-width="100px"
        ref="DayShiftForm" :rules="addItem_rules">
 <el-form-item label="班次名称" prop="ds_name">
          <el-input class="formItem" v-model="DayShiftModel.ds_name" placeholder="请填写标记类型名称">
          </el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="ds_starttime">
          <el-input class="formItem" type="textarea" :rows="2" v-model="DayShiftModel.ds_starttime" placeholder="开始时间">
          </el-input>
        </el-form-item>
         <el-form-item label="结束时间" prop="ds_endtime">
          <el-input class="formItem" v-model="DayShiftModel.ds_endtime" placeholder="结束时间">
          </el-input>
        </el-form-item>
        <el-form-item label="是否报工" prop="is_report">
          <el-input class="formItem" type="textarea" :rows="2" v-model="DayShiftModel.is_report" placeholder="是否报工">
          </el-input>
        </el-form-item>
        <el-form-item label="时长" prop="ds_period">
          <el-input class="formItem" type="textarea" :rows="2" v-model="DayShiftModel.ds_period" placeholder="时长">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addDayShiftVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveDayShiftClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "shift_group",
  data() {
    return {
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",
      itemCondition: "",
      itemListCondition: "",
      dataCondition: "",
      taskData: [], //表格数据
      DayShiftData: [], //物料
      itemListData: [], //物料
      selection: [], //选中行数据
      itemSelection: [],
      dataSelection: [],
      currentRow: {},
      addTaskVisiable: false,
      addDayShiftVisible: false,
      addTaskDataVisible: false,
    
      bottomDataShow: false,
      shiftGroupModel: {},
      DayShiftModel: {},
      DayShiftModelList: [],
      taskDataModel: {},
      addOrNot: true, //是否新增
      addTaskText: "",
      addDayShiftText: "",
      addTaskDataText: "",
      activeName: "first",
      loading: false,
      loading2: false,
      loading3: false,
      add_rules: {
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      },
      addItem_rules: {
        item_name: [{ required: true, message: "请选择物料", trigger: "blur" }],
        sti_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      },
 
    };
  },
  filters: {
    datatrans(value) {
      if (!value || value == "9999-12-31") return "";
      //时间戳转化大法
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    },
    stTypeTrans(value) {
      switch (value) {
        case "task":
          return "任务";
          break;
        case "work":
          return "节点";
          break;
      }
    }
  },
//   watch: {
//     addTaskVisiable(val) {
//       if (val) {
//         this.selectDept();
//       }
//     }
//   },
  methods: {
    //刷新任务树
    refreshHead() {
      this.taskData = [];
      this.currentRow = {};
      this.bottomDataShow = false;
      this.refreshBottom();
      this.z_get("api/shift_group", { condition: this.condition })
        .then(res => {
        
          this.taskData = res.data;
        })
        .catch(res => {});
    },
    //刷新班次明细
    refreshItemData() {
      this.loading = true;
      this.DayShiftData = [];
      this.z_get(
        "api/day_shift",
        { st_id: this.currentRow.st_id, condition: this.itemCondition },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.DayShiftData = res.data;
        })
        .catch(res => {});
    },
 

    refreshBottom() {
      this.itemCondition = "";
      this.dataCondition = "";
    },
    search() {
      this.condition = "";
      this.refreshHead();
    },
    searchItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
   
    },
    searchData() {
      this.dataCondition = "";
   
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleSelectionChange2(val) {
      this.itemSelection = val;
    },
    handleSelectionChange3(val) {
      this.dataSelection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].st_id == val[0].st_id) {
          select = true;
          break;
        }
      }
      for (var i = 0; i < val.length; i++) {
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.selection.indexOf(val[i]) == -1) {
          this.$refs.shiftGroupTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.shiftGroupTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //显示任务dialog
    addNewTaskShow() {
    //var titleName = "";
      var st_pid = null;
    this.addTaskText = "新增班次组";
      this.shiftGroupModel = {
        st_id: 0,
        st_pid: st_pid,
        dept_id: "",
        dept_name: "",
        st_name: "",
        st_type: "task",
        st_period: "",
        st_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/shift_group", this.shiftGroupModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshHead();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.shiftGroupModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.shiftGroupModel.UpdateColumns) {
              this.z_put("api/shift_group", this.shiftGroupModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshHead();
                  this.addTaskVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTaskVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑任务
    editTaskShow(row) {
      this.shiftGroupModel = JSON.parse(JSON.stringify(row));
      this.shiftGroupModel.dept_name = this.renderFilter(
        this.shiftGroupModel.dept_id,
     
      );
      this.addTaskText = "编辑节点";
      this.addOrNot = false;
      this.addTaskVisiable = true;
    },
 
    //确认删除任务
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
              this.refreshHead();
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
    //显示新增班次明细
    addNewDayShiftShow() {
      this.DayShiftModelList = [];
      this.searchItemList();
      this.addOrNot = true;
      this.addDayShiftVisible = true;
    },
    //保存/编辑选中物料
    onSaveDayShiftClick() {
      this.$refs.DayShiftForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            //新增
            this.DayShiftModelList.push(
              JSON.parse(JSON.stringify(this.DayShiftModel))
            );
           
          } else {
            //修改
            this.DayShiftModel.UpdateColumns = this.$refs.DayShiftForm.UpdateColumns;
            if (this.DayShiftModel.UpdateColumns) {
              this.z_put("api/day_shift", this.DayShiftModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshItemData();
             
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
            
            }
          }
        }
      });
    },
    //保存新增班次
    onSaveDetailClick() {
      if (this.DayShiftModelList.length > 0) {
        for (var i = 0; i < this.DayShiftModelList.length; i++) {
          if (!this.DayShiftModelList[i].sti_quantity) {
            this.$alert("物料" + (i + 1) + "数量未填写", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
            return;
          }
        }
        this.z_post("api/day_shift/list", this.DayShiftModelList)
          .then(res => {
            this.$message({
              message: "新增成功!",
              type: "success",
              duration: 1000
            });
            this.addDayShiftVisible = false;
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
    //显示编辑班次明细
    editItemShow(row) {
      this.DayShiftModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addDayShiftText = "编辑班次明细";
     
    },
    //删除一个班次明细
    deleteOneItem(row) {
      var list = [];
      list.push(row);
      this.onDeleteItemClick(list);
    },
    //删除多个班次明细
    deleteListItem() {
      if (this.itemSelection.length) {
        this.onDeleteItemClick(this.itemSelection);
      }
    },
    //确认删除班次明细
    onDeleteItemClick(list) {
      this.$confirm("是否删除物料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/day_shift/list", { data: list })
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
    //双击选中物料
    handleRowDbClcik(row) {
      this.DayShiftModel = {
        st_id: this.currentRow.st_id,
        item_no: row.item_no,
        item_name: row.item_name,
        sti_quantity: "",
        sti_note: ""
      };
      var isContain = false;
      for (var i = 0; i < this.DayShiftData.length; i++) {
        if (this.DayShiftData[i].item_no == this.DayShiftModel.item_no) {
          isContain = true;
          break;
        }
      }
      for (var i = 0; i < this.DayShiftModelList.length; i++) {
        if (this.DayShiftModelList[i].item_no == this.DayShiftModel.item_no) {
          isContain = true;
          break;
        }
      }
      if (isContain) {
        this.$alert("已存在该物料!", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
      } else {
        this.addOrNot = true;
        this.addDayShiftText = "新增班次明细";
       
      }
    },


    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
   
    },
    //删除选中的物料
    deleteSelectItem(index) {
      this.DayShiftModelList.splice(index, 1);
    }
  },
  mounted() {
    this.refreshHead();
   
  }
};
</script>

<style scoped>
.shift_group {
  width: 1100px;
}
.formItem {
  width: 300px;
}
.formItem2 {
  width: 200px;
}
.transferDiv {
  display: inline-block;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 350px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}
</style>