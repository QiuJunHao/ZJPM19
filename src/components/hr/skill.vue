<template>
  <div>
    <div class="skill">     
      <div class="tbar">
        <el-button
          icon="el-icon-refresh"
          title="刷新"
          size="mini"
          circle
          @click="search"
        ></el-button>
        <el-input
          @keyup.enter.native="refreshData" v-model="condition"
          placeholder="请输入内容"
          style="width:300px;"
        >
          <el-button @click="refreshData" slot="append" icon="el-icon-search"
            >搜索</el-button
          >
        </el-input>

        <el-button
          type="primary"
          style="margin-left:10px;"
          @click="addNewskill" size="small"
          >新增
          </el-button>
        <el-button type="primary" size="small">导入</el-button>
     </div>
     
      <div class="gridTable">
          <el-table ref="taskTable" style="width: 100%;" :height="bottomDivShow?'500px':'560px'" :data="taskData"
            tooltip-effect="dark" highlight-current-row row-key="st_id" default-expand-all
           >
            
            <el-table-column prop="skill_name" label="技能名称" align="center" width="180">
            </el-table-column>
            <el-table-column prop="skill_note" label="技能说明" align="center" width="180">
              <template slot-scope="scope">{{scope.row.dept_id | renderFilter(deptDataFilter)}}
              </template>
               <template slot-scope="scope">{{scope.row.st_type | stTypeFilter}}</template>
            </el-table-column>
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


              
 






    <!-- <el-input 
          size="small" 
          @keyup.enter.native="refreshData" 
          placeholder="请输入技能名称" 
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
          >新增
          </el-button>

      <el-button 
          type="danger" 
          size="small" :disabled="selection.length==0" >
            导入
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
           </el-table>

      <el-table-column 
            prop="skill_name" 
            label="技能名称" 
            align="center" 
            width="100"
            ></el-table-column>
      
       <el-table-column 
            prop="skill_note" 
            label="技能说明" 
            align="center" 
            width="100"
            ></el-table-column>
          </el-tabs>
          </div>
        </div>
      </div>
    </div>

    

<!--<style scoped>
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