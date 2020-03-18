<template>
  <div class="projectList">
    <el-container>
      <el-aside class="asideContent" width='220px'>
        <div class="leftTop">

        </div>
        <div class="leftBottom">
          <el-card class="leftBottomCard" shadow="never">
            <div slot="header">
              <span>项目分类</span>
              <el-button icon="el-icon-refresh" style="float: right;" title="刷新" size="mini" circle
                @click="refreshClassData">
              </el-button>
            </div>
            <div style="flex:1;overflow-y:auto;">
              <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current class="classTree">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;height:30px;line-height: 30px;"
                  @click="handleSelectTreeClick(data)">
                  <img style="width:16px;" src="../../assets/img/tag.png" />
                  <span style="margin-left:3px;">{{data.pc_name}}</span>
                </div>
              </el-tree>
            </div>
          </el-card>
        </div>
      </el-aside>
      <el-main class="mainContent">
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classData: [],
      selectClass: {},
      projectCondition:'',
    };
  },
  methods: {
    refreshClassData() {
      this.classData = [];
      this.selectClass = {};
      this.searchProject();
      this.z_get("api/project_classification/treeList")
        .then(res => {
          this.classData = res.data;
        })
        .catch(res => {});
    },
    refreshProjectData(){},
    searchProject() {
        this.projectCondition = "";
        this.refreshProjectData();
    },
    //选中的分类
    handleSelectTreeClick(data) {
      this.selectClass = data;
      this.searchProject();
    }
  },
  mounted(){
      this.refreshClassData();
      this.searchProject();
  }
};
</script>>

<style scoped>
.projectList {
  width: 1200px;
}
.asideContent {
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}
.leftTop {
  width: 100%;
  flex: 1;
}
.leftBottom {
  width: 100%;
  height: 60%;
}
.leftBottomCard {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.mainContent {
  border-left: 5px solid #eee;
  padding: 0 0 0 10px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.gridTable {
  flex: 1;
}
</style>
<style>
.classTree .el-tree-node__content {
  height: 30px;
}
.leftBottomCard .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>