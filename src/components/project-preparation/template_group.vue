<template>
  <div class="template_group_waiting">
    <el-container style="height: 600px;">
      <el-aside class="tgaside" width="220px" style="padding-right:10px;">
        <el-card style="height:100%;box-sizing:border-box;" shadow="never">
          <div slot="header">
            <el-row>
              <span>模板分类</span>
              <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshClass"></el-button>

              <el-dropdown :hide-on-click="false" style="margin-left: 70px">
                <span class="el-dropdown-link">
                  <i class="el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addNewTemplateTypeGroup">
                    新增模板分类
                  </el-dropdown-item>
                  <!-- <el-dropdown-item @click.native="editTempGroupTypeShow(scope.currentRow)"> -->
                  <el-dropdown-item @click.native="editTempGroupTypeShow(selectClass)">
                    编辑模板类型
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="onDeleteOneTempGroupType(selectClass)">
                    删除模板类型
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <!-- <el-button style="margin-left=0" type="primary" size="mini" icon="el-icon-folder-add" circle
                @click="addNewTemplateTypeGroup">
              </el-button> -->
              <!-- <el-button type="primary" icon="el-icon-edit" size="mini" circle
                @click="editTempGroupTypeShow(scope.row)">
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                @click="onDeleteOneTempGroupType(scope.row)">
              </el-button> -->
            </el-row>
          </div>

          <div highlight-current @click="refreshClass"
            style="width:100%;user-select:none;height:30px;line-height: 30px;">
            <el-tooltip effect="dark" content="点击显示所有模板信息" placement="left">
              <span style="margin-left:3px;"><img style="width:16px;" src="../../assets/img/tag.png" /> 全部分类</span>
            </el-tooltip>
          </div>
          <!-- <el-button type="text" @click="refreshTemplateData()" style="width:100%;user-select:none;height:30px;line-height: 30px;"><img style="width:16px;" src="../../assets/img/tag.png" />全部分类</el-button> -->
          <el-tree :data="tgtData" node-key="tgt_id" ref="tree" default-expand-all :expand-on-click-node="false"
            highlight-current class="classTree">
            <div slot-scope="{node, data}" style="width:100%;user-select:none;height:30px;line-height: 30px;"
              @click="handleSelectTreeClick(data)">
              <el-tooltip class="item" effect="dark" placement="left">
                <div slot="content">{{data.tgt_note}}</div>
                <!-- <span @contextmenu.prevent.native="openMenu($event)" style="margin-left:3px;"><img style="width:16px;"
                    src="../../assets/img/tag.png" /> {{data.tgt_name}}</span> -->
                <span style="margin-left:3px;"><img style="width:16px;" src="../../assets/img/tag.png" />
                  {{data.tgt_name}}</span>
              </el-tooltip>

            </div>
          </el-tree>
        </el-card>
        <!-- <template v-show="menuvisible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
          <el-button style="margin-left=0" type="primary" size="mini" icon="el-icon-folder-add" circle
            @click="addNewTemplateTypeGroup">
          </el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTempGroupTypeShow(scope.row)">
          </el-button>
          <el-button type="danger" disabled size="mini" icon="el-icon-delete" circle
            @click="onDeleteOneTempGroupType(scope.row)">
          </el-button>
        </template> -->
      </el-aside>
      <el-container>
        <el-main style="border-left:10px solid #eee;padding:0 0 0 10px;">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshClass"></el-button>
            <el-input disabled size="small" @keyup.enter.native="refreshTemplateData" placeholder="请输入模板名称"
              v-model="condition" clearable style="width:250px;">
              <el-button disabled @click="refreshTemplateData" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
            <el-button type="primary" size="small" style="margin-left:10px;" :disabled="!selectClass.tgt_id"
              @click="addNewTemplateGroup('root')">新增根节点
            </el-button>
            <el-button type="primary" size="small" v-if="currentRow.tg_id && selectClass.tgt_id"
              @click="addNewTemplateGroup('children')">新增子节点
            </el-button>
            <!-- <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中组织结构模板({{selection.length}})
        </el-button> -->
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
          <div>
            <el-table ref="tgTable" v-loading="loading" style="width: 100%;" height="450px" :data="TemplateGroupData"
              tooltip-effect="dark" highlight-current-row row-key="tg_id" default-expand-all border
              @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="wp_id" label="组织岗位名称" align="center" width="280">
                <template slot-scope="scope">{{scope.row.wp_id | renderFilter(PostDataFilter)}}</template>
              </el-table-column>
              <el-table-column prop="tg_node_type" label="节点类型" align="center" width="120">
                <template slot-scope="scope">{{scope.row.tg_node_type | stTypeTrans}}</template>
              </el-table-column>
              <el-table-column prop="tg_note" label="说明" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="140" prop="handle">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle
                    @click="editTemplateGroupShow(scope.row)">
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
        <!-- 新增/修改模板表单 -->
        <el-dialog v-if="addgpVisiable" v-dialogDrag width="450px" :title="addgpText" :close-on-click-modal="false"
          :visible.sync="addgpVisiable">
          <zj-form size="small" :newDataFlag='addgpVisiable' :model="templateModel" label-width="100px"
            ref="templateForm" :rules="add_rules">
            <el-form-item label="岗位名称" prop="wp_id">
              <el-select v-model="templateModel.wp_id" ref="select_post" placeholder="请选择岗位">
                <el-option v-for="item in PostDataFilter" :key="item.value" :label="item.display" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组织模板名称" prop="tg_name">
              <el-input class="formItem" v-model="templateModel.tg_name" placeholder="请填写组织模板名称">
              </el-input>
            </el-form-item>
            <el-form-item label="节点类型" prop="tg_node_type">
              <el-select class="formItem" v-model="templateModel.tg_node_type" placeholder="请选择节点类型">
                <el-option v-for="item in stTypeTrans" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="说明">
              <el-input class="formItem" type="textarea" :rows="2" v-model="templateModel.tg_note" placeholder="备注信息">
              </el-input>
            </el-form-item>
            <el-form-item style="text-align:center;margin-right:100px;">
              <el-button size="medium" @click="addgpVisiable = false">取&nbsp;&nbsp;消</el-button>
              <el-button type="primary" size="medium" @click="onSaveTempClick" style="margin-left:30px;">保&nbsp;&nbsp;存
              </el-button>
            </el-form-item>
          </zj-form>
        </el-dialog>
        <!-- 新增/修改模板类型表单 -->
        <el-dialog width="500px" :title="addgptText" :close-on-click-modal="false" :visible.sync="addgptVisiable"
          top="5vh" @closed="refreshForm">
          <el-form :model="templateGroupTypeModel" label-width="100px" ref="templateGroupTypeForm" :rules="add_rules">
            <!-- <el-form-item label="模板类型编号">
              <el-input class="formItem" v-model="templateGroupTypeModel.tgt_id" placeholder="系统自动生成" disabled>
              </el-input>
            </el-form-item> -->
            <el-form-item label="模板类型名称">
              <el-input class="formItem" v-model="templateGroupTypeModel.tgt_name" placeholder="请填写模板类型名称">
              </el-input>
            </el-form-item>
            <el-form-item label="模板类型说明">
              <el-input class="formItem" type="textarea" :rows="2" v-model="templateGroupTypeModel.tgt_note"
                placeholder="模板类型说明">
              </el-input>
            </el-form-item>

            <el-form-item style="text-align:center;margin-right:100px;">
              <el-button @click="addgptVisiable = false">取&nbsp;&nbsp;消</el-button>
              <el-button type="primary" @click="onSaveTempGroupTypeClick" style="margin-left:30px;">保&nbsp;&nbsp;存
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-container>

    </el-container>
  </div>
</template>


<script>
export default {
  name: "template_group",
  data() {
    return {
      menuvisible: false,
      top: 0,
      left: 0,
      condition: "",
      TemplateGroupData: [], //表格数据
      addgpVisiable: false,
      templateModel: {},
      addOrNot: true, //是否新增
      addgpText: "",
      selection: [], //选中行数据
      activeName: "first",
      tgtData: [], //表格数据
      PostDataFilter: [],

      addgptVisiable: false,
      templateGroupTypeModel: {},
      selectClass: {},
      addgptText: "",
      loading: false,
      currentRow: {},
      stTypeTrans: [
        {
          value: "人",
          label: "人"
        },
        {
          value: "组织",
          label: "组织"
        }
      ],
      add_rules: {
        wp_id: [{ required: true, message: "请选择岗位", trigger: "change" }],
        tg_node_type: [
          { required: true, message: "请选择节点类型", trigger: "change" }
        ]
      }
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
        case "人":
          return "人";
          break;
        case "组织":
          return "组织";
          break;
        default:
          return "人";
          break;
      }
    }
  },
  watch: {
    addgpVisiable(val) {
      if (val) {
        this.selectPost();
      }
    },
    // addgptVisiable(val) {
    //   if (val) {
    //     this.selectPost();
    //   }
    // },
    menuvisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  methods: {
    refreshData() {
      this.TemplateGroupData = [];
      this.currentRow = {};
      this.z_get("api/template_group/treeList") //等数据库更新
        .then(res => {
          this.PostDataFilter = res.dict.wp_id;

          this.TemplateGroupData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.tgForm.resetFields();
    },
    search() {
      this.condition = "";
      this.refreshTemplateData();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    //刷新部门数据
    selectPost() {
      this.z_get("api/work_post", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.postData) != JSON.stringify(res.data)) {
            this.postData = res.data;
          }
        })
        .catch(res => {});
    },
    //双击选择岗位
    handleSelectTreeDblClick(data) {
      this.templateModel.wp_id = data.wp_id;
      this.templateModel.wp_name = data.wp_name;
      this.$refs.select_post.blur();
    },
    //显示任务dialog
    addNewTemplateGroup(type) {
      var titleName = "";
      var tg_pid = null;

      if (type == "root") {
        this.addgpText = "新增 [" + this.selectClass.tgt_name + "] 的根节点";
      } else if (type == "children") {
        tg_pid = this.currentRow.tg_id;
        titleName = this.renderFilter(
          this.currentRow.wp_id,
          this.PostDataFilter
        );
        this.addgpText =
          "新增" +
          " [" +
          this.selectClass.tgt_name +
          "] > " +
          "[" +
          titleName +
          "] 的子节点";
      }
      this.templateModel = {
        tg_id: 0,
        wp_id: "",
        tg_pid: tg_pid,
        tgt_id: this.selectClass.tgt_id ? this.selectClass.tgt_id : "",
        tg_name: "",
        tg_note: "",
        tg_node_type: ""
      };
      this.addOrNot = true;
      this.addgpVisiable = true;
    },

    onSaveTempClick() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/template_group", this.templateModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshTemplateData();
                this.addgpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.templateModel.UpdateColumns = this.$refs.templateForm.UpdateColumns;
            if (this.templateModel.UpdateColumns) {
              this.z_put("api/template_group", this.templateModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshTemplateData();
                  this.addgpVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addgpVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    // //编辑数据
    // editTemplateGroupShow(row) {
    //   this.templateModel = JSON.parse(JSON.stringify(row));
    //   //this.templateModel.tgt_id = this.filterDeptName(this.templateModel.wp_id);

    //   this.addgpText = "编辑组织结构模板";
    //   this.addOrNot = false;
    //   this.addgpVisiable = true;
    // },
    //显示编辑任务
    editTemplateGroupShow(row) {
      this.templateModel = JSON.parse(JSON.stringify(row));
      // this.templateModel.wp_name = this.renderFilter(
      //   this.templateModel.wp_id,
      //   this.postDataFilter
      // );
      this.addgpText = "编辑节点";
      this.addOrNot = false;
      this.addgpVisiable = true;
    },

    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？节点下的子节点将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/template_group/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshTemplateData();
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

    //点击行可以切换选中状态
    //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        // //点击加载tab数据
        // this.refreshBottom();
        // this.refreshItemData();
        // this.refreshDataData();
      }
      // this.bottomDataShow = true;
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
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshItemListData();
    },

    refreshTemplateData() {
      if (this.selectClass.tgt_id) {
        this.loading = true;
        this.TemplateGroupData = [];
        this.currentRow = {};
        this.z_get(
          "api/template_group/treeList",
          {
            tgt_id: this.selectClass.tgt_id,
            condition: this.renderFilter(this.condition, this.PostDataFilter)
          },
          { loading: false }
        )
          .then(res => {
            this.loading = false;
            this.PostDataFilter = res.dict.wp_id;
            this.classFilter = res.dict.tgt_id;
            this.TemplateGroupData = res.data;
          })
          .catch(res => {});
      }
    },
    searchTemplate() {
      this.condition = "";
      this.refreshTemplateData();
    },
    //选中的分类
    handleSelectTreeClick(data) {
      this.selectClass = data;
      this.searchTemplate();
    },
    //!!!!模板类型方法
    refreshClass() {
      this.tgtData = [];
      this.selectClass = {};
      // this.refreshTemplateData();
      this.z_get("api/template_group_type")
        .then(res => {
          this.tgtData = res.data;
        })
        .catch(res => {});
      this.refreshData();
    },
    addNewTemplateTypeGroup() {
      this.addgptText = "新增模板类型";
      this.templateGroupTypeModel = {
        tgt_id: 0,
        tgt_name: "",
        tgt_note: ""
      };
      this.addOrNot = true;
      this.addgptVisiable = true;
    },
    onSaveTempGroupTypeClick() {
      this.$refs.templateGroupTypeForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/template_group_type", this.templateGroupTypeModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshClass();
                this.addgptVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/template_group_type", this.templateGroupTypeModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshClass();
                this.addgptVisiable = false;
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
    editTempGroupTypeShow(row) {
      this.templateGroupTypeModel = JSON.parse(JSON.stringify(row));
      //this.templateGroupTypeModel.tgt_id = this.filterDeptName(this.templateGroupTypeModel.wp_id);
      this.addgptText = "编辑模板类型";
      this.addOrNot = false;
      this.addgptVisiable = true;
    },
    //删除一个
    onDeleteOneTempGroupType(row) {
      var list = [];
      list.push(row);
      this.onDeleteTempGroupTypeClick(list);
    },
    //删除树
    deleteTempGroupTypeList() {
      if (this.selection.length) {
        this.onDeleteTempGroupTypeClick(this.selection);
      }
    },
    onDeleteTempGroupTypeClick(list) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/template_group_type/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshTemplateData();
            })
            .catch(res => {
              this.$alert("删除失败", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    openMenu(e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY - 60; // fix 位置bug
      this.menuvisible = true;
    },
    closeMenu() {
      this.menuvisible = false;
    }
  },
  mounted() {
    this.refreshTemplateData();
    this.refreshClass();
  }
};
</script>

<style scoped>
.template_group_waiting {
  width: 1100px;
}

.tgheader {
  line-height: 60px;
}
.tgaside {
  width: 80px;
}
.tbar {
  margin-bottom: 10px;
}
.classTree .el-tree-node__content {
  height: 30px;
}
</style>