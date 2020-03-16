<template>
  <div class="project_group">
    <div class="containAll">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
        <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入组织编号或名称" v-model="condition"
          style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button size="small" type="primary" style="margin-left:10px;" @click="addNewproject_group('root')">新增根节点</el-button>
        <el-button size="small" type="primary" :disabled="selection.length!=1" @click="addNewproject_group('children')">新增子节点
        </el-button>
        <el-button size="small" type="danger" :disabled="selection.length==0" @click="deleteList">
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
        <el-table ref="project_groupTable" style="width: 100%" :height="menuTableHeight" :data="tableData" tooltip-effect="dark"
          highlight-current-row row-key="project_group_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick" @row-dblclick="handleRowDbClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="wp_id" label="组织名称" align="center" width="220"></el-table-column>
          <!-- 是否写死，还是动态查数据  -->
          <!-- <template slot-scope="scope">{{scope.row.project_group_note | project_groupTypeTrans}}</template> -->
          <el-table-column label="说明" prop="project_group_note" align="center"></el-table-column>
          <el-table-column label="操作" width="150" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editproject_groupShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
<!-- 新增/修改组织表单 -->
    <el-dialog v-if="addproject_groupVisiable" v-dialogDrag width="450px" :title="addproject_groupText" :close-on-click-modal="false"
      :visible.sync="addproject_groupVisiable">
      <zj-form size="small" :newDataFlag='addproject_groupVisiable' :model="project_groupModel" label-width="100px" ref="project_groupForm"
        :rules="add_rules">
        <el-form-item label="组织名称" prop="project_group_id">
         <el-input class="formItem" v-model="project_groupModel.project_group_pid" placeholder="请填写组织名称">
          </el-input>
         <!-- <el-select v-model="project_groupModel.project_group_id" ref="select_project_group" placeholder="请选择组织名称">
            <el-option :label="project_groupModel.project_group_name" :value="project_groupModel.project_group_id" style="height:auto;padding:0;">
              <el-tree :data="project_groupData" node-key="project_group_id" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current :current-node-key="project_groupModel.project_group_id">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeDblClick(data)">
                  {{data.project_group_name}}</div>
              </el-tree>
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="project_groupModel.project_group_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addproject_groupVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveproject_groupClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "project_group",
  components: {},
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      project_groupDataFilter: [],
      selection: [],
      addproject_groupVisiable: false,
      project_groupModel: {},
      addOrNot: true, //是否新增
      addproject_groupText: "",
      activeName: "emp_project_group",
      project_groupIdSelect: 0, //传入tab的部门id，注意类型
      project_groupNameSelect: "未选中部门", //传入tab的部门名称
      isChildUpdate1: true, //保证tab不会同时渲染所有tab，且每次点击某tab都会重新渲染该tab
      isChildUpdate2: false,
      isChildUpdate3: false,
      isChildUpdate4: false,
      project_groupType_options: [
        {
          value: 1,
          label: "部门"
        },
        {
          value: 2,
          label: "小组"
        }
      ],
      add_rules: {
        wp_id: [{ required: true, message: "请填写部门名称", trigger: "blur" }],
        project_group_note: [
          { required: true, message: "请输入部门类型", trigger: "change" }
        ]
      },
      menuTableHeight: 0
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
    project_groupTypeTrans(value) {
      switch (value) {
        case 1:
          return "部门";
          break;
        case 2:
          return "小组";
          break;
      }
    },
    calendarTypeTrans(value) {
      switch (value) {
        case 1:
          return "日历类型1";
          break;
        case 2:
          return "日历类型2";
          break;
      }
    },
    shiftTypeTrans(value) {
      switch (value) {
        case 1:
          return "班次类型1";
          break;
        case 2:
          return "班次类型2";
          break;
      }
    }
  },
  methods: {
    //刷新组织树
    refreshData() {
      this.tableData = [];
      this.currentRow = {};
      this.z_get("api/project_group/treeList", { condition: this.condition })
        .then(res => {
          this.project_groupDataFilter = res.dict.wp_id;
          this.tableData = res.data;
        })
        .catch(res => {});
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.tableData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].project_group_id == val[0].project_group_id) {
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
          this.$refs.project_groupTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.project_groupTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //显示组织dialog
    addNewproject_groupShow(type) {
      var titleName = "";
      var project_group_pid = null;
      if (type == "root") {
        titleName = "";
        this.addproject_groupText = "新增根节点";
      } else if (type == "children") {
        project_group_pid = this.currentRow.project_group_id;
        //titleName = this.currentRow._name;
        titleName = this.renderFilter(
          this.currentRow.wp_id,
          this.project_groupDataFilter
        );
        this.addproject_groupText = "新增[" + titleName + "]的子节点";
      }
      this.project_groupModel = {
        project_group_id: 0,
        wp_id: "",
        project_group_pid: project_group_pid,
        project_group_name: "",
        project_group_note: ""
      };
      this.addOrNot = true;
      this.addproject_groupVisiable = true;
    },
    //保存新增/编辑组织
    onSaveproject_groupClick() {
      this.$refs.project_groupForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/project_group", this.project_groupModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addproject_groupVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.project_groupModel.UpdateColumns = this.$refs.project_groupForm.UpdateColumns;
            if (this.project_groupModel.UpdateColumns) {
              this.z_put("api/project_group", this.project_groupModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addproject_groupVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addproject_groupVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑组织
    editproject_groupShow(row) {
      this.project_groupModel = JSON.parse(JSON.stringify(row));
    //   this.project_groupModel.project_group_name = this.renderFilter(
    //     this.project_groupModel.project_group_id,
    //     this.project_groupDataFilter
    //   );
      this.addproject_groupText = "编辑节点";
      this.addOrNot = false;
      this.addproject_groupVisiable = true;
    },
    //删除一个组织
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除组织树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //确认删除组织
    onDeleteClick(list) {
      this.$confirm(
        "是否删除？节点下的子节点及各节点的物料与资料需求将一并删除！",
        "提示",
        {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }
      )
        .then(() => {
          this.z_delete("api/project_group/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    //刷新部门数据
    selectproject_group() {
      this.z_get("api/project_group/tree", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.project_groupData) != JSON.stringify(res.data)) {
            this.project_groupData = res.data;
          }
        })
        .catch(res => {});
    },
    //双击选择部门
    handleSelectTreeDblClick(data) {
      this.project_groupModel.project_group_id = data.project_group_id;
      this.project_groupModel.project_group_name = data.project_group_name;
      this.$refs.select_project_group.blur();
    },
    //点击组织行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
    },
    handleRowDBClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
    //   this.bottomDivShow = true;
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
    },
    //重新计算table高度
    resizeTable() {
      this.menuTableHeight = 0;
      let that = this;
      this.$nextTick(function() {
        let h = that.$refs.project_groupTable.$el.parentNode.offsetHeight;
        that.menuTableHeight = h;
      });
    }
  },
  mounted() {
    this.resizeTable();
    this.refreshData();
    
  }
};
</script>

<style scoped>
.project_group {
  width: 1100px;
}
.formItem {
  width: 300px;
}
.gridTable {
  flex: 1;
}
</style>