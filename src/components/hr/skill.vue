<template>
  <div class="employee">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button
           icon="el-icon-refresh" 
           title="刷新" size="mini" 
           circle @click="search"
           ></el-button>

          <el-input 
          size="small" 
          @keyup.enter.native="refreshData" 
          placeholder="请输入人员编号或姓名" 
          v-model="condition" clearable
            style="width:250px;">
            <el-button 
            size="small" 
            @click="refreshData" 
            slot="append" 
            icon="el-icon-search"
            >搜索</el-button>
          </el-input>

          <el-button 
          type="primary" 
          size="small" 
          style="margin-left:10px;" 
          @click="addEmpShow('root')"
          >新增人员
          </el-button>

          <el-button 
          type="danger" 
          size="small" :disabled="selection.length==0" >
            导出
          </el-button>
        </div>


        <div class="gridTable">
          <el-table 
          ref="taskTable" 
          style="width: 100%;" 
          height="250px" 
          :data="taskData" tooltip-effect="dark"
          highlight-current-row row-key="emp_no" 
          default-expand-all 
          @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" 
          @row-click="handleRowClick">
            
            <el-table-column 
            prop="emp_id" 
            label="序号" 
            align="center" 
            width="100"
            ></el-table-column>

            <el-table-column 
            prop="emp_no" 
            label="工号" 
            align="center" 
            width="100"
            ></el-table-column>

            <el-table-column 
            prop="emp_name" 
            label="人员名称" 
            align="center" 
            width="130"
            ></el-table-column>

            <el-table-column 
            prop="emp_sex" 
            label="性别" 
            align="center" 
            width="100">
              <template 
              slot-scope="scope">
              {{scope.row.sex_type | empSexTrans}}
              </template>
            </el-table-column>

            <el-table-column 
            prop="emp_phone" 
            label="联系电话" 
            align="center" 
            width="150"
            ></el-table-column>

            <el-table-column 
            prop="emp_2Phone" 
            label="备用联系电话" 
            align="center" 
            width="150"
            ></el-table-column>

            <el-table-column 
            prop="st_note3" 
            label="状态" 
            align="center" 
            width="130"
            ></el-table-column>
            
            <el-table-column label="操作" width="160" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="bottomLayout" style="min-height:300px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="人员技能" name="first">
            <div v-if="bottomDataShow">
              <div class="tbar">
                <el-button 
                icon="el-icon-refresh" 
                title="刷新" size="mini" 
                circle @click="searchItem"
                ></el-button>

                <el-input 
                size="small" 
                @keyup.enter.native="refreshItemData" 
                placeholder="请输入技能名称"
                v-model="itemCondition" 
                clearable style="width:250px;">
                  <el-button 
                  size="small" 
                  @click="refreshItemData" 
                  slot="append" 
                  icon="el-icon-search"
                  >搜索</el-button>
                </el-input>

                <el-button 
                type="primary" 
                size="small" 
                style="margin-left:10px;" 
                @click="addNewEmpItemShow"
                >新增人员技能信息
                </el-button>

                <!-- <el-button 
                type="danger" 
                size="small" 
                :disabled="itemSelection.length==0" 
                @click="deleteListItem">
                  删除选中物料({{itemSelection.length}})
                </el-button> -->
                
              </div>

              <div class="gridTable">
                <el-table 
                ref="empItemTable" 
                v-loading="loading" 
                style="width:100%;" 
                height="250" 
                :data="empItemData"
                tooltip-effect="dark" 
                highlight-current-row border 
                @selection-change="handleSelectionChange2">

                  <el-table-column 
                  type="index" 
                  label="序号"
                  width="80" 
                  align="center">
                  </el-table-column>

                  <el-table-column 
                  prop="item_name" 
                  label="技能名称" 
                  align="center" 
                  width="150"
                  ></el-table-column>

                  <el-table-column 
                  prop="item_no" 
                  label="技能等级" 
                  align="center" 
                  width="150"
                  ></el-table-column>

                  <el-table-column 
                  prop="sti_quantity" 
                  label="技能说明" 
                  align="center" 
                  width="200"
                  ></el-table-column>

                  <el-table-column 
                  prop="评定时间" 
                  label="评定时间" 
                  align="center" 
                  width="160"
                  ></el-table-column>

                  <el-table-column 
                  prop="sti_note" 
                  label="评定人" 
                  align="center"
                  width="130"
                  ></el-table-column>

                  <el-table-column 
                  label="操作" 
                  width="140" 
                  prop="handle">
                    <template slot-scope="scope">
                      <el-button 
                      type="primary" 
                      icon="el-icon-edit" 
                      size="mini" 
                      circle @click="editItemShow(scope.row)">
                      </el-button>

                      <el-button 
                      type="danger" 
                      icon="el-icon-delete" 
                      size="mini" circle
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

    <!-- 新增/修改人员信息 -->
    <el-dialog 
    v-if="addEmpVisiable" 
    v-dialogDrag width="450px" 
    :title="addEmpText" 
    :close-on-click-modal="false"
    @closed= "refreshForm"
    :visible.sync="addEmpVisiable">

      <zj-form size="small" 
      :newDataFlag='addEmpVisiable' 
      :model="empModel" 
      label-width="100px" 
      ref="empForm"
        :rules="add_rules">

        <el-form-item label="人员编号" prop="emp_no">
          <el-input
           v-model="empModel.emp_no" 
           autocomplete="off" 
           placeholder="请填写任务名称">
          </el-input>
        </el-form-item>
        
        <el-form-item label="人员名称" prop="emp_name">
          <el-input 
          class="formItem" 
          v-model="empModel.emp_name" 
          placeholder="请填写任务名称">
          </el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-select 
          v-model="empModel.sex_type" 
          placeholder="请选择性别类型">
            <el-option 
            v-for="item in empSex_options" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
        label="联系电话" 
        prop="emp_phone">
          <el-input 
          class="formItem" 
          v-model="empModel.emp_phone" 
          placeholder="请填写联系电话">
          </el-input>
        </el-form-item>

        <el-form-item 
        label="备用电话" 
        prop="emp_2Phone">
          <el-input 
          class="formItem" 
          v-model="empModel.emp_2Phone" 
          placeholder="请填写备用电话">
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button 
          size="medium"
           @click="addEmpVisiable = false"
           >取&nbsp;&nbsp;消</el-button>
          <el-button 
          type="primary" 
          size="medium" 
          @click="onSaveTaskClick" style="margin-left:30px;"
          >保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>


    <!-- 新增/编辑技能需求 -->
    <!-- <el-dialog 
    
    v-dialogDrag width="450px" 
    title="新增技能需求" 
    :close-on-click-modal="false"
    :visible.sync="addEmpItemVisible">
      <zj-form size="small" :newDataFlag='addEmpItemVisible' :model="empTechModel" label-width="100px"
        ref="tastTechForm" :rules="addTech_rules">

        <el-form-item 
        label="技能名称" 
        prop="std_name">
          <el-input 
          class="formItem" 
          v-model="empTechModel.std_name" 
          placeholder="请填写技能名称">
          </el-input>
        </el-form-item>

        <el-form-item 
        label="技能等级" 
        prop="std_name">
          <el-input 
          class="formItem" 
          v-model="empTechModel.std_name" 
          placeholder="请填写技能等级">
          </el-input>
        </el-form-item>

        <el-form-item 
        label="技能说明">
          <el-input 
          class="formItem" 
          type="textarea" 
          :rows="2" 
          v-model="empTechModel.std_note" placeholder="备注信息">
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addEmpItemVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTechClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>



      </zj-form>
      
    </el-dialog> -->
  <!--  <el-dialog 
    v-if="addEmpVisiable" 
    v-dialogDrag width="450px" 
    :title="addEmpText" 
    :close-on-click-modal="false"
    @closed= "refreshForm"
    :visible.sync="addEmpVisiable">
      <zj-form size="small" 
      :newDataFlag='addEmpVisiable' 
      :model="empModel" 
      label-width="100px" 
      ref="empForm"
        :rules="add_rules">-->

    <el-dialog    
    v-dialogDrag width="450px" 
    title="新增技能需求" 
    :close-on-click-modal="false"
    :visible.sync="addEmpItemVisible">
      <zj-form size="small" :newDataFlag='addEmpItemVisible' :model="empTechModel" label-width="100px"
        ref="tastTechForm" :rules="addTech_rules">

        <el-form-item 
        label="技能名称" 
        prop="std_name">
          <el-input 
          class="formItem" 
          v-model="empTechModel.std_name" 
          placeholder="请填写技能名称">
          </el-input>
        </el-form-item>

        <el-form-item 
        label="技能等级" 
        prop="std_name">
          <el-input 
          class="formItem" 
          v-model="empTechModel.std_name" 
          placeholder="请填写技能等级">
          </el-input>
        </el-form-item>

        <el-form-item 
        label="技能说明">
          <el-input 
          class="formItem" 
          type="textarea" 
          :rows="2" 
          v-model="empTechModel.std_note" placeholder="备注信息">
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addEmpItemVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTechClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>



      </zj-form>
      
    </el-dialog> 



  </div>
</template>

<script>
export default {
  name: "employee",
  data() {
    return {
      empModel:{},
      empFormVisible: false,
      condition: "",
      addEmpText: "",
      addOrNot: true, //是否新增


      limit: 10,
      currentPage: 1,
      total: 0,
      itemCondition: "",
      itemListCondition: "",
      dataCondition: "",
      taskData: [], //表格数据
      empItemData: [], //物料
      itemListData: [], //物料
      empDataData: [], //资料
      dataTypeFilter: [],
      empDataFilter: [], //人员渲染数据
      selection: [], //选中行数据
      itemSelection: [],
      dataSelection: [],
      currentRow: {},
      addEmpVisiable: false,
      addEmpItemVisible: false,
      addEmpDataVisible: false,
      selectItemVisible: false,
      bottomDataShow: false,
      empModel: {},
      empItemModel: {},
      empItemModelList: [],
      empTechModel: {},
      addOrNot: true, //是否新增
      addTaskItemText: "",
      addTaskDataText: "",
      activeName: "first",
      loading: false,
      loading2: false,
      loading3: false,
      
      empSex_options: [
        {
          value: 1,
          label: "男性"
        },
        {
          value: 0,
          label: "女性"
        }
      ],

      add_rules: {
        /*
        ID：emp_id
        人员编号：emp_no
        人员名称：emp_name
        电子邮箱：emp_mail
        性别：emp_sex
        联系电话：emp_phone
        备用联系电话：emp_2Phone
        出生日期：date_birth 
        在职状态（在职/离职）：emp_state
        */
        emp_no: [{ 
          required: true, message: "请填写人员编号", trigger: "blur" }
          ],
        emp_name: [{ 
          required: true, message: "请填写人员名称", trigger: "blur" }
          ],
        emp_sex: [{ 
          required: true, message: "请选择人员性别", trigger: "change" }
          ],
        emp_phone: [{ 
          required: true, message: "请填写联系电话", trigger: "blur" }
          ],
        emp_2Phone: [{ 
          required: true, message: "请填写备用电话", trigger: "blur" }
          ],
        emp_state: [{ 
          required: true, message: "请选择在职状态", trigger: "change" }
          ],

        /*
        序号：
        ID：emp_id
        技能ID：skill_id
        技能名称：skill_name
        技能等级ID:sl_id
        技能等级名称：sl_name
        技能说明：skill_note
        创建时间：create_date
        评定人：create_user
        */

       emp_id: [{ 
          required: true, message: "请填写人员编号", trigger: "blur" }
          ],
       skill_id: [{ 
          required: true, message: "请填写技能编号", trigger: "blur" }
          ],
       skill_name: [{ 
          required: true, message: "请填写技能名称", trigger: "blur" }
          ],
       sl_id: [{ 
          required: true, message: "请填写技能等级", trigger: "blur" }
          ],
       sl_name: [{ 
          required: true, message: "请填写技能名称", trigger: "blur" }
          ],
      skill_note: [{ 
          required: true, message: "请填写技能说明", trigger: "blur" }
          ],
      create_date: [{ 
          required: true, message: "请填写创建时间", trigger: "blur" }
          ],
      create_user: [{ 
          required: true, message: "请填写创建人", trigger: "blur" }
          ],
        
          
          
      
      





        emp_name: [
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


      addTech_rules: {
        std_name: [
          { required: true, message: "请填写资料名称", trigger: "blur" }
        ],
        ddt_id: [
          { required: true, message: "请选择资料类型", trigger: "change" }
        ],
        std_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      }
    };
  },

  filters: {
    empSexTrans(value) {
      switch (value) {
        case 1:
          return "男性";
          break;
        case 0:
          return "女性";
          break;
      }
    }
  },






  /* watch: {
    addEmpVisiable(val) {
      if (val) {
        this.selectEmp();
      }
    }
  }, */
  methods: {
    //刷新任务树
    refreshData() {
      this.z_get("api/employee", { condition: this.condition })
        .then(res => {
/*           this.empDataFilter = res.dict.emp_no; */
          this.taskData = res.data;
        })
        .catch(res => {});
    },
    //显示任务dialog
    addEmpShow() {
      this.addOrNot = true;
      this.addEmpVisiable = true;
      this.addEmpText = "新增人员";
    },

    search() {
      this.condition = "";
      this.refreshData();
    },

    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.empForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/employee", this.empModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addEmpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.empModel.UpdateColumns = this.$refs.empForm.UpdateColumns;
            if (this.empModel.UpdateColumns) {
              this.z_put("api/employee", this.empModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addEmpVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });

                });
            } else {
              return false;
            }
          }
        } 
      });
    },

    //显示编辑任务
    editTaskShow(row) {
      this.empModel = JSON.parse(JSON.stringify(row));
      this.addEmpText = "编辑节点";
      this.addOrNot = false;
      this.addEmpVisiable = true;
    },
 
    //刷新物料需求
    refreshItemData() {
      this.loading = true;
      this.empItemData = [];
      this.z_get(
        "api/standard_task_item",
        { emp_no: this.currentRow.emp_no, condition: this.itemCondition },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.empItemData = res.data;
        })
        .catch(res => {});
    },
    //刷新资料需求
    refreshDataData() {
      this.empDataData = [];
      this.z_get(
        "api/standard_task_data",
        { emp_no: this.currentRow.emp_no, condition: this.dataCondition },
        { loading: false }
      )
        .then(res => {
          this.dataTypeFilter = res.dict.ddt_id;
          this.empDataData = res.data;
        })
        .catch(res => {});
    },
    //刷新物料item表
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
    refreshBottom() {
      this.itemCondition = "";
      this.dataCondition = "";
    },
    
    searchItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
      this.refreshItemListData();
    },
    searchData() {
      this.dataCondition = "";
      this.refreshDataData();
    },

    


/*     //保存新增技能信息
    onSaveTechClick(){
      this.$refs.tastTechForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/skill_employee", this.empTechModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.tastTechForm.UpdateColumns = this.$refs.tastTechForm.UpdateColumns;
            if (this.empTechModel.UpdateColumns) {
              this.z_put("api/skill_employee", this.empTechModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
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
    }, */
    

    //删除一个人员
    deleteOne(row) {
      this.z_delete("api/employee", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("操作失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
              console.log(res);
            });
    },
    //删除一个人员
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //确认删除任务
    onDeleteClick(list) {
      this.$confirm("是否删除？节点下的子节点将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/employee/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
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





    //刷新人员数据
    selectEmp() {
      this.z_get("api/emp", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.deptData) != JSON.stringify(res.data)) {
            this.deptData = res.data;
          }
        })
        .catch(res => {});
    },
    //双击选择部门
    handleSelectTreeDblClick(data) {
      this.empModel.dept_id = data.dept_id;
      this.empModel.dept_name = data.dept_name;
      this.$refs.select_dept.blur();
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
        this.refreshDataData();
      }
      this.bottomDataShow = true;
    },
    //删除选中的物料
    deleteSelectItem(index) {
      this.empItemModelList.splice(index, 1);
    }
  },
  mounted() {
    this.refreshData();
    this.selectEmp();
  }
};
</script>

<style scoped>
.employee {
  width: 1100px;
}
.formItem {
  width: 300px;
}
.formItem2 {
  width: 200px;
}
.transferDiv {
  display: inline;
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