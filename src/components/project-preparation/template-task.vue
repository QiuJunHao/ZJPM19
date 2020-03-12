<template>
  <div class="template-task">
    <div class="containAll">
      <div style="margin-bottom:10px;">
        <span>选择模板：</span>
        <el-select size="small" v-model="selectTemplateId" placeholder="请选择模板">
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
        <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskShow('root')">新增根节点
        </el-button>
        <el-button type="primary" size="small" :disabled="!currentRow.tt_id" @click="addNewTaskShow('children')">
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
        <el-table ref="taskTable" style="width: 100%;" :height="bottomDivShow?'250px':'560px'" :data="taskData"
            tooltip-effect="dark" highlight-current-row row-key="tt_id" default-expand-all
            @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="tt_name" label="任务名称" align="center" width="180"></el-table-column>
            <el-table-column prop="dept_id" label="部门" align="center" width="180">
              <template slot-scope="scope">{{scope.row.dept_id | renderFilter(deptDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="tt_period" label="工期(天)" align="center" width="100"></el-table-column>
            <el-table-column prop="tt_type" label="类别" align="center" width="100">
              <template slot-scope="scope">{{scope.row.tt_type | stTypeTrans}}</template>
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
    </div>
  </div>
</template>

<script>
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
      addTaskVisiable: false,
      addOrNot: true,
      taskData:[],
      bottomDivShow:false,
    };
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
    refreshData() {},
    search() {
      this.condition = "";
      this.refreshData();
    },
    //显示任务dialog
    addNewTaskShow(type) {
      var titleName = "";
      var tt_pid = null;
      if (type == "root") {
        titleName = "";
        this.addTaskText = "新增根节点";
      } else if (type == "children") {
        tt_pid = this.currentRow.tt_id;
        titleName = this.currentRow.tt_name;
        this.addTaskText = "新增[" + titleName + "]的子节点";
      }
      this.taskModel = {
        tt_id: 0,
        tt_pid: tt_pid,
        dept_id: "",
        dept_name: "",
        tt_name: "",
        tt_type: "task",
        tt_period: "",
        tt_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
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
        if (selection[i].tt_id == val[0].tt_id) {
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
        //点击加载tab数据
        this.refreshBottom();
        this.refreshItemData();
        this.refreshDataData();
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
    if (this.$route.params.templateId) {
      this.selectTemplateId = this.$route.params.templateId;
    }
    this.refreshTemplateData();
  }
};
</script>

<style scoped>
.template-task {
  width: 1100px;
}
</style>