<template>
  <div class="template-task">
    <div class="containAll">
      <div style="margin-bottom:10px;">
        <span>选择模板：</span>
        <el-select size="small" v-model="selectTemplateId" placeholder="请选择模板" @change="selTemplate">
          <el-option v-for="item in projectTemplateData" :key="item.pt_id"
            :label="renderFilter(item.pc_no,classFilter) +'-' + item.pt_name" :value="item.pt_id"></el-option>
        </el-select>
      </div>
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition" clearable
          style="width:250px;">
          <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" size="small" style="margin-left:10px;" :disabled="!selectTemplateId"
          @click="addNewTaskShow('root')">新增根节点
        </el-button>
        <el-button type="primary" size="small" :disabled="!currentRow.tt_no" @click="addNewTaskShow('children')">
          新增子节点
        </el-button>
        <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
          删除选中节点({{selection.length}})
        </el-button>
        <el-dropdown style="margin-left:10px;">
          <el-button size="small">
            操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
            <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="gridTable">
        <el-table ref="taskTable" style="width: 100%;" :height="bottomDivShow?'250px':'500px'" :data="taskData"
          tooltip-effect="dark" highlight-current-row row-key="tt_no" default-expand-all
          @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="tt_name" label="任务名称" align="center" width="180"></el-table-column>
          <el-table-column prop="tt_period" label="工期(天)" align="center" width="100"></el-table-column>
          <el-table-column prop="tt_node_level" label="层级" align="center" width="100">
            <template slot-scope="scope">{{scope.row.tt_node_level | levelFilter}}</template>
          </el-table-column>
          <el-table-column prop="tt_node_type" label="类别" align="center" width="100">
            <template slot-scope="scope">{{scope.row.tt_node_type | stTypeFilter}}</template>
          </el-table-column>
          <el-table-column prop="tt_note" label="说明" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="140" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottomLayout">
        <el-tabs v-model="activeName" style="min-height:50px;">
          <el-tab-pane label="物料需求" name="first">
            <keep-alive>
              <taskItem v-if="bottomDataShow&&bottomDivShow" :currentRow='currentRow' source='template'></taskItem>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="资料需求" name="second">
            <keep-alive>
              <taskDataComponent v-if="bottomDataShow&&bottomDivShow" :currentRow='currentRow' source='template'>
              </taskDataComponent>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="紧前任务" name="third">
          </el-tab-pane>
          <el-tab-pane label="紧后任务" name="forth">
          </el-tab-pane>
        </el-tabs>
        <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
          @click="bottomDivShow=!bottomDivShow"></i>
      </div>
    </div>

    <!-- 新增/修改任务表单 -->
    <el-dialog v-if="addTaskVisiable" v-dialogDrag width="450px" :title="addTaskText" :close-on-click-modal="false"
      :visible.sync="addTaskVisiable">
      <zj-form size="small" :newDataFlag='addTaskVisiable' :model="taskModel" label-width="100px" ref="taskForm"
        :rules="add_rules">
        <!-- <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="taskModel.dept_id" ref="select_dept" placeholder="请选择部门">
            <el-option :label="taskModel.dept_name" :value="taskModel.dept_id" style="height:auto;padding:0;">
              <el-tree :data="deptData" node-key="dept_id" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current :current-node-key="taskModel.dept_id">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeDblClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="任务名称" prop="pt_name">
          <el-input class="formItem" v-model="taskModel.tt_name" placeholder="请填写任务名称">
          </el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="taskModel.tt_node_type" placeholder="请选择任务类型">
            <el-option v-for="item in stType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工期(天)" prop="tt_period">
          <el-input class="formItem" v-model="taskModel.tt_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskModel.tt_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

  </div>
</template>

<script>
import taskItem from "./common/taskItem";
import taskDataComponent from "./common/taskData";

export default {
  data() {
    return {
      selectTemplateId: "",
      projectTemplateData: [],
      condition: "",
      selection: [],
      currentRow: [],
      taskModel: {},
      addTaskText: "",
      activeName: "first",
      addOrNot: true,
      taskData: [],
      addTaskVisiable: false,
      bottomDataShow: false,
      bottomDivShow: false,
      loading: false,
      stType_options: [
        {
          value: "task",
          label: "任务"
        },
        {
          value: "work",
          label: "节点"
        }
      ],
      add_rules: {
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      }
    };
  },
  components: {
    taskItem,
    taskDataComponent
  },
  filters: {
    stTypeFilter(value) {
      switch (value) {
        case "task":
          return "任务";
          break;
        case "work":
          return "节点";
          break;
      }
    },
    levelFilter(value) {
      switch (value) {
        case "base":
          return "基准";
          break;
        case "detail":
          return "详细";
          break;
      }
    }
  },
  methods: {
    refreshTemplateData() {
      this.projectTemplateData = [];
      this.z_get("api/project_template", { pc_no: 0, condition: "" })
        .then(res => {
          this.classFilter = res.dict.pc_no;
          this.projectTemplateData = res.data;
        })
        .catch(res => {});
    },
    refreshData() {
      if (this.selectTemplateId) {
        this.taskData = [];
        this.currentRow = {};
        this.bottomDataShow = false;
        this.bottomDivShow = false;
        this.z_get("api/template_task/treeList", {
          pt_id: this.selectTemplateId,
          condition: this.condition
        })
          .then(res => {
            this.taskData = res.data;
          })
          .catch(res => {});
      }
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    selTemplate(val) {
      this.selectTemplateId = val;
      this.search();
    },
    //显示任务dialog
    addNewTaskShow(type) {
      var titleName = "";
      var tt_pno = null;
      var level = null;
      if (type == "root") {
        titleName = "";
        level = "base";
        this.addTaskText = "新增根节点";
      } else if (type == "children") {
        tt_pno = this.currentRow.tt_no;
        titleName = this.currentRow.tt_name;
        level = "detail";
        this.addTaskText = "新增[" + titleName + "]的子节点";
      }
      this.taskModel = {
        tt_no: 0,
        tt_pno: tt_pno,
        pt_id: this.selectTemplateId,
        //dept_id: "",
        //dept_name: "",
        tt_name: "",
        tt_node_type: "task",
        tt_node_level: level,
        tt_period: "",
        tt_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    editTaskShow(row) {
      this.taskModel = JSON.parse(JSON.stringify(row));
      // this.taskModel.dept_name = this.renderFilter(
      //   this.taskModel.dept_id,
      //   this.deptDataFilter
      // );
      this.addTaskText = "编辑节点";
      this.addOrNot = false;
      this.addTaskVisiable = true;
    },
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/template_task", this.taskModel)
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
            this.taskModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.taskModel.UpdateColumns) {
              this.z_put("api/template_task", this.taskModel)
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
    },
    deleteOne() {},
    deleteList() {},
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].tt_no == val[0].tt_no) {
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
    //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
      this.bottomDivShow = true;
      this.bottomDataShow = true;
    },
    //展开所有节点
    expandAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") == -1) {
            icon[i].click();
          }
        }
      }
    },
    //折叠所有节点
    collapseAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") > -1) {
            icon[i].click();
          }
        }
      }
    }
  },
  mounted() {
    this.refreshTemplateData();
    if (this.$route.params.templateId) {
      this.selectTemplateId = this.$route.params.templateId;
      this.refreshData();
    }
  }
};
</script>

<style scoped>
.template-task {
  width: 1100px;
}
.bottomLayout{
  position: relative;
}
</style>