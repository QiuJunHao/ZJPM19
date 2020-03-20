<template>
  <div class="main">
    <div class="left">
      <div style="padding:20px 10px 10px 10px;display:flex;align-items:center;">
        <el-button plain type="primary" icon="el-icon-plus" style="margin-right:10px;" size="mini" circle title="新增系统模块"
          @click="isAddModule=true"></el-button>
        <el-input size="small" @input="filterModuleData" placeholder="系统模块过滤" v-model="module_condition" clearable
          prefix-icon='el-icon-search'>
        </el-input>
      </div>
      <el-table ref="moduleTable" style="width:100%;" :data="moduleData" tooltip-effect="dark" highlight-current-row
        :show-header="false" fit row-key="module_id" :current-row-key="currentModule.module_id"
        @current-change="handleModuleRowClick">
        <el-table-column prop="module_name" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="center">
      <div class="center-title">
        <span>{{currentModule.module_name}}</span>
        <el-button style="margin:auto 5px; width:60px" size="mini" round
          @click="moduleModel=currentModule;isEditModule=true">编辑</el-button>
      </div>
      <div class="tbar">
        <el-input size="small" @keyup.enter.native="refreshMenuData" placeholder="菜单名/链接" v-model="menu_condition"
          clearable style="width:200px;">
          <el-button slot="append" icon="el-icon-search" @click="refreshMenuData"></el-button>
        </el-input>
        <el-button type="primary" size="small" style="margin-left:10px;"
          @click="isAddMenu=true;menuModel.module_id=currentModule.module_id;">新增菜单
        </el-button>
        <el-button type="primary" size="small"
          @click="isAddMenu=true;menuModel.module_id=currentModule.module_id;menuModel.menu_pid=currentMenu.menu_id;"
          :disabled="!currentMenu.menu_id">
          新增子菜单
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
      <div>
        <el-table ref="menuTable" style="width: 100%;" height="500px" :data="menuData" tooltip-effect="dark"
          highlight-current-row row-key="menu_id" default-expand-all @current-change="handleMenuRowClick"
          @selection-change="handleMenuSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="menu_name" label="菜单名称" align="left" width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="menu_link" label="菜单链接" align="left" width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="menu_icon" label="菜单图标" align="center" width="100"></el-table-column>
          <el-table-column label="操作" width="150" align="center" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editMenu(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteMenu(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right">
      <div class="right-title">
        <span>{{currentMenu.menu_name}}</span>
      </div>
      <div class="tbar">
        <el-button size="mini" round :disabled="!currentMenu.menu_id"
          @click="isAddElement=true;elementModel.menu_id=currentMenu.menu_id;">新增</el-button>
        <el-button size="mini" round @click="isEditElement=true;elementModel=currentElement"
          :disabled="!currentElement.element_id">编辑</el-button>
        <el-button size="mini" round plain type="danger" :disabled="elementSelection.length==0"
          @click="onDeleteElementListClick">
          删除选中({{elementSelection.length}})
        </el-button>
      </div>
      <el-table ref="elementTable" style="width:100%;" :data="elementData" tooltip-effect="dark" highlight-current-row
        fit row-key="element_id" @current-change="handleElementRowClick"
        @selection-change="handleElementSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="element_name" label="页面元素名称" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="element_code" label="页面元素代码" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <!-- 新增模块 -->
    <el-dialog width="450px" :title="isAddModule?'新增系统模块':'编辑系统模块'" :close-on-click-modal="false"
      :visible.sync="moduleFormVisible" @closed="moduleModel={}">
      <zj-form size="small" :newDataFlag='isEditModule' :model="moduleModel" label-width="100px" ref="moduleForm"
        :rules="add_module_rules">
        <el-form-item label="模块名称" prop="module_name">
          <el-input class="form-item" v-model="moduleModel.module_name" placeholder="请填写模块名称">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="medium" @click="isAddModule=false;isEditModule=false;">取&nbsp;&nbsp;消</el-button>
          <el-button type="danger" size="medium" v-show="isEditModule" @click="onDeleteModuleClick">删&nbsp;&nbsp;除
          </el-button>
          <el-button type="primary" size="medium" @click="onSaveModuleClick">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
    <!-- 新增编辑菜单 -->
    <el-dialog width="450px" :title="isAddMenu?'新增菜单':'编辑菜单'" :close-on-click-modal="false"
      :visible.sync="menuFormVisible" @closed="menuModel={}">
      <zj-form size="small" :newDataFlag='isEditMenu' :model="menuModel" label-width="100px" ref="menuForm"
        :rules="add_menu_rules">
        <el-form-item label="所属模块">
          <el-input class="form-item" v-model="currentModule.module_name" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="上级菜单" v-show="menuModel.menu_pid">
          <el-input class="form-item" v-model="currentMenu.menu_name" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input class="form-item" v-model="menuModel.menu_name" placeholder="请填写菜单名称">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_link">
          <el-input class="form-item" v-model="menuModel.menu_link">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menu_icon">
          <el-input class="form-item" v-model="menuModel.menu_icon">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="isAddMenu=false;isEditMenu=false;">取&nbsp;&nbsp;消</el-button>
          <el-button type="danger" size="medium" v-show="isEditMenu" @click="deleteMenu(menuModel)">删&nbsp;&nbsp;除
          </el-button>
          <el-button type="primary" size="medium" @click="onSaveMenuClick">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
    <!-- 新增编辑页面元素 -->
    <el-dialog width="450px" :title="isAddElement?'新增页面元素':'编辑页面元素'" :close-on-click-modal="false"
      :visible.sync="elementFormVisible" @closed="elementModel={}">
      <zj-form size="small" :newDataFlag='isEditElement' :model="elementModel" label-width="110px" ref="elementForm"
        :rules="add_element_rules">
        <el-form-item label="所属菜单">
          <el-input class="form-item" v-model="currentMenu.menu_name" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="页面元素名称" prop="element_name">
          <el-input class="form-item" v-model="elementModel.element_name" placeholder="请填写页面元素名称">
          </el-input>
        </el-form-item>
        <el-form-item label="页面元素代码" prop="element_code">
          <el-input class="form-item" v-model="elementModel.element_code" placeholder="请填写页面元素代码">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="isAddElement=false;isEditElement=false;">取&nbsp;&nbsp;消</el-button>
          <el-button type="danger" size="medium" v-show="isEditElement" @click="onDeleteElementClick">删&nbsp;&nbsp;除
          </el-button>
          <el-button type="primary" size="medium" @click="onSaveElementClick">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      moduleData: [],
      moduleMetaData: [],
      menuData: [],
      elementData: [],
      currentModule: {},
      currentMenu: {},
      currentElement: {},
      menu_condition: "",
      selection: [],
      moduleModel: {},
      menuModel: {},
      elementModel: {},
      isAddModule: false,
      isEditModule: false,
      isAddMenu: false,
      isEditMenu: false,
      isAddElement: false,
      isEditElement: false,
      module_condition: "",
      elementSelection: [],
      add_module_rules: {
        module_name: [
          { required: true, message: "请填写模块名称", trigger: "blur" }
        ]
      },
      add_menu_rules: {
        menu_name: [
          { required: true, message: "请填写模块名称", trigger: "blur" }
        ]
      },
      add_element_rules: {
        element_name: [
          { required: true, message: "请填写页面元素名称", trigger: "blur" }
        ],
        element_code: [
          { required: true, message: "请填写页面元素代码", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    moduleFormVisible:{
      get: function () {
        return this.isAddModule || this.isEditModule;
      },
      set: function (v) {
        if(!v){
          this.isAddModule=false;
          this.isEditModule=false;
        }
      }
    },
    menuFormVisible:{
      get: function () {
        return this.isAddMenu || this.isEditMenu;
      },
      set: function (v) {
        if(!v){
          this.isAddMenu=false;
          this.isEditMenu=false;
        }
      }
    },
    elementFormVisible:{
      get: function () {
        return this.isAddElement || this.isEditElement;
      },
      set: function (v) {
        if(!v){
          this.isAddElement=false;
          this.isEditElement=false;
        }
      }
    },
  },
  methods: {
    //刷新数据
    refreshModuleData(setcurrent) {
      this.moduleData = [];
      this.z_get("api/module", { condition: "" })
        .then(res => {
          this.moduleMetaData = res.data;
          this.filterModuleData();
          if (!this.currentModule.module_id || setcurrent)
            this.currentModule = res.data[0];
          this.refreshMenuData();
        })
        .catch(res => {});
    },
    filterModuleData() {
      var th = this;
      this.moduleData = this.moduleMetaData.filter(function(value) {
        return value.module_name.indexOf(th.module_condition) != -1;
      });
    },
    refreshMenuData() {
      this.z_get("api/menu/treeofmodule", {
        module_id: this.currentModule.module_id,
        condition: this.menu_condition
      })
        .then(res => {
          this.menuData = res.data;
          this.currentMenu={};
        })
        .catch(res => {});
    },
    handleModuleRowClick(row) {
      this.currentModule = row == null ? {} : row;
      this.refreshMenuData();
    },
    handleMenuSelectionChange(val) {
      this.selection = val;
    },
    handleMenuRowClick(row) {
      this.currentMenu = row == null ? {} : row;
      this.refreshElementData();
    },
    handleElementSelectionChange(val) {
      this.elementSelection = val;
    },
    handleElementRowClick(row) {
      this.currentElement = row == null ? {} : row;
    },
    refreshElementData() {
      this.z_get("api/element/listofmenu", {
        menu_id: this.currentMenu.menu_id
      })
        .then(res => {
          this.elementData = res.data;
          this.currentElement={};
        })
        .catch(res => {});
    },
    //保存模块
    onSaveModuleClick() {
      this.$refs.moduleForm.validate(valid => {
        if (valid) {
          if (this.isAddModule) {
            this.z_post("api/module", this.moduleModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshModuleData();
                this.isAddModule = false;
              })
              .catch(res => {
                this.$alert("新增失败：" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.moduleModel.UpdateColumns = this.$refs.moduleForm.UpdateColumns;
            if (this.moduleModel.UpdateColumns) {
              this.z_put("api/module", this.moduleModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshModuleData();
                  this.isEditModule = false;
                })
                .catch(res => {
                  this.$alert("编辑失败" + res.msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    //删除模块
    onDeleteModuleClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/module", { data: this.moduleModel })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.isEditModule = false;
              this.refreshModuleData(true);
            })
            .catch(res => {
              this.$alert("删除失败：" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    //删除菜单
    onDeleteMenuClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/menu", { data: this.menuModel })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.isEditMenu = false;
              this.currentMenu = {};
              this.refreshMenuData();
            })
            .catch(res => {
              this.$alert("删除失败：" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    //保存菜单
    onSaveMenuClick() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (this.isAddMenu) {
            this.z_post("api/menu", this.menuModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshMenuData();
                this.isAddMenu = false;
              })
              .catch(res => {
                this.$alert("新增失败：" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.menuModel.UpdateColumns = this.$refs.menuForm.UpdateColumns;
            if (this.menuModel.UpdateColumns) {
              this.z_put("api/menu", this.menuModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshMenuData();
                  this.isEditMenu = false;
                })
                .catch(res => {
                  this.$alert("编辑失败" + res.msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    editMenu(row) {
      this.menuModel = row;
      this.isEditMenu = true;
    },
    deleteMenu(row) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/menu", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.isEditMenu = false;
              this.refreshMenuData();
            })
            .catch(res => {
              this.$alert("删除失败：" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    onSaveElementClick() {
      this.$refs.elementForm.validate(valid => {
        if (valid) {
          if (this.isAddElement) {
            this.z_post("api/element", this.elementModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshElementData();
                this.isAddElement = false;
              })
              .catch(res => {
                this.$alert("新增失败：" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.elementModel.UpdateColumns = this.$refs.elementForm.UpdateColumns;
            if (this.elementModel.UpdateColumns) {
              this.z_put("api/element", this.elementModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshElementData();
                  this.isEditElement = false;
                })
                .catch(res => {
                  this.$alert("编辑失败" + res.msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    onDeleteElementClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/element", { data: this.elementModel })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.isEditElement = false;
              this.currentElement = {};
              this.refreshElementData();
            })
            .catch(res => {
              this.$alert("删除失败：" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    onDeleteElementListClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          let ids = [];
          for (let i = 0; i < this.elementSelection.length; i++) {
            const item = this.elementSelection[i];
            ids.push(item.element_id);
          }
          this.z_delete("api/element/list", { data: ids })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.isEditElement = false;
              this.refreshElementData();
            })
            .catch(res => {
              this.$alert("删除失败：" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
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
    this.refreshModuleData();
  }
};
</script>

<style scoped>
.main {
  width: 1350px;
  padding: 0;
  display: flex;
  flex-direction: row;
}
.left {
  width: 250px;
  border-right: 1px solid #dedede;
}
.center {
  width: 800px;
  padding: 15px 25px;
}
.center-title {
  width: 100%;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.right {
  width: 300px;
  padding: 15px 25px;
  border-left: 1px solid #dedede;
}
.right-title {
  width: 100%;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.form-item {
  width: 300px;
}
.form-button-item {
  display: flex;
  justify-items: center;
  align-items: center;
}
</style>