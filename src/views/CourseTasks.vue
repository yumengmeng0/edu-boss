<template>
  <section class="course-tasks">
    <!-- 头部 -->
    <div class="header">
      <!-- 显示当前课程的名称 -->
      <el-page-header @back="() => this.$router.back()" :content="addSectionForm.course_name" />

      <!-- 添加章节按钮 -->
      <el-button type="primary" icon="el-icon-plus" @click="handleShowAddSection">添加章节</el-button>
    </div>

    <!-- 树形控件,展示课程对应的章节信息 -->
    <el-tree :data="sections" :props="treeProps" v-loading="loading" element-loading-text="数据加载中...">
      <!-- slot-scope:代表当前树节点内容,有两个参数 data表示当前树节点, node表示当前节点状态 -->
      <div class="inner" slot-scope="{ data, node }">
        <!-- 显示章节明（data.section_name）或课时名（data.theme） -->
        <span>{{ data.section_name || data.theme }}</span>

        <!-- 操作按钮 -->
        <span class="actions" v-if="node.level == 1">
          <!-- 编辑章节  @click.stop 阻止事件冒泡 -->
          <el-button size="small" @click.stop="handleEditSection(data)">编辑</el-button>
          <!-- 添加课时   -->
          <el-button size="small" @click.stop="handleShowAddLesson(data)">+添加课时</el-button>
          <!-- 修改章节状态 -->
          <el-button size="small" @click.stop="showSectionStatus(data)">{{ statusMapping[data.status] }}
          </el-button>
        </span>
        <span class="actions" v-if="node.level == 2">
          <!-- 编辑课时 -->
          <el-button size="small" @click.stop="handleEditLesson(data, node)">编辑</el-button>
          <!-- 上传视频   -->
          <el-button size="small" @click.stop="uploadVideo(data)">上传视频</el-button>
          <!-- 修改课时状态 -->
          <el-button size="small" @click.stop="showLessonStatus(data)">{{ statusMapping[data.status] }}
          </el-button>
        </span>
      </div>
    </el-tree>
    <!-- 树形控件,展示课程对应的章节信息 -->

    <!-- 修改章节状态-对话框 -->
    <el-dialog class="toggle-dialog" title="提示" :visible.sync="showSectionStatusForm" width="30%">
      <header class="toggle-header">
        <i class="el-icon-info"></i>
        <span>
          当前状态：{{
              sectionStatusForm.data && statusMapping[sectionStatusForm.data.status]
          }}
        </span>
      </header>

      <el-form label-position="right" label-width="110px" :model="sectionStatusForm">
        <el-form-item label="状态变更为：">
          <!--  
          @change="$forceUpdate()" 强制刷新，防止第二次修改状态时选中的状态不变 
          -->
          <el-select @change="$forceUpdate()" v-model="sectionStatusForm.status" style="width: 100%">
            <el-option v-for="(item, index) in Object.keys(statusMapping)" :key="index" :label="statusMapping[item]"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showSectionStatusForm = false">取 消</el-button>
        <el-button type="primary" @click="updateSectionStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改章节状态 -->

    <!-- 添加或修改章节 -->
    <el-dialog class="add-dialog" title="章节信息" :visible.sync="showAddSection">
      <el-form label-position="right" label-width="80px" ref="addSectionForm" :model="addSectionForm">
        <el-form-item label="课程名称" prop="course_name">
          <el-input v-model="addSectionForm.course_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="section_name">
          <el-input v-model="addSectionForm.section_name"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input type="textarea" v-model="addSectionForm.description"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="order_num">
          <!-- 只允许输入数字 -->
          <el-input v-model="addSectionForm.order_num" type="number"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddSection = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSection">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加或修改章节 -->


    <!-- 添加或修改课时 -->
    <el-dialog class="add-dialog" title="课时信息" :visible.sync="showAddLesson">
      <el-form label-position="right" label-width="100px" ref="addSectionForm" :model="addLessonForm">
        <el-form-item label="课程名称" prop="course_name">
          <el-input v-model="addLessonForm.course_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="section_name">
          <el-input v-model="addLessonForm.section_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="theme">
          <el-input v-model="addLessonForm.theme"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input type="number" v-model="addLessonForm.duration"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
            <template slot="append">请输入数字，单位：分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" prop="is_free">
          <el-radio-group v-model="addLessonForm.is_free">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课时排序" prop="order_num">
          <el-input v-model="addLessonForm.order_num" type="number"
            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddLesson = false">取 消</el-button>
        <el-button type="primary" @click="handleAddLesson">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加或修改课时 -->

   <!-- 修改课时状态-对话框 -->
    <el-dialog class="toggle-dialog" title="提示" :visible.sync="showLessonStatusForm" width="30%">
      <header class="toggle-header">
        <i class="el-icon-info"></i>
        <span>
          当前状态：{{
              lessonStatusForm.data && statusMapping[lessonStatusForm.data.status]
          }}
        </span>
      </header>

      <el-form label-position="right" label-width="110px" :model="lessonStatusForm">
        <el-form-item label="状态变更为：">
          <!--  
          @change="$forceUpdate()" 强制刷新，防止第二次修改状态时选中的状态不变 
          -->
          <el-select @change="$forceUpdate()" v-model="lessonStatusForm.status" style="width: 100%">
            <el-option v-for="(item, index) in Object.keys(statusMapping)" :key="index" :label="statusMapping[item]"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showLessonStatusForm = false">取 消</el-button>
        <el-button type="primary" @click="updateLessonStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修课时状态 -->

  </section>
</template>

<script>
//引入axios
import { axios } from "../utils";

export default {
  name: "CourseTasks",
  title: "课程结构",
  data() {
    // 表单校验规则
    const rules = {
      course_name: [
        { required: true, message: "请输入课程名称", trigger: "blur" },
        { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
      ],
      brief: [
        { required: true, message: "请输入课程简介", trigger: "change" },
        { min: 5, max: 100, message: "长度在 5 到 100 个字符", trigger: "blur" }
      ],
      teacher_name: [
        { required: true, message: "请输入讲师姓名", trigger: "change" },
        { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
      ],
      teacher_info: [
        { required: true, message: "请输入讲师简介", trigger: "change" },
        { min: 5, max: 50, message: "长度在 5 到 50 个字符", trigger: "blur" }
      ],
      preview_first_field: [
        { required: true, message: "请输入课程概述", trigger: "change" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
      ],
      preview_second_field: [
        { required: true, message: "请输入课程概述", trigger: "change" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
      ],
      price: [{ required: true, message: "请输入课程售价", trigger: "change" }],
      share_img: [
        { required: true, message: "请上传分享图片", trigger: "change" }
      ],
      share_title: [
        { required: true, message: "请输入分享标题", trigger: "change" }
      ],
      share_description: [
        { required: true, message: "请输入分享简介", trigger: "change" }
      ]
    };


    //定义章节信息
    const addSectionForm = {
      course_id: undefined,
      course_name: "",
      section_name: "",
      description: "",
      order_num: 0
    };

    //定义课时信息
    const addLessonForm = {
      course_id: undefined,
      course_name: "",
      section_name: "",
      theme: "", // 课时名
      is_free: 0,
      duration: 0,
      order_num: 0
    };

    //定义章节信息
    const editLessonForm = {
      course_id: undefined,
      course_name: "",
      section_name: "",
      theme: "", // 课时名
      is_free: 0,
      duration: 0,
      order_num: 0
    };

    //章节与课时信息,树形结构
    const treeProps = {
      label: item => {
        return item.section_name || item.theme;
      },
      children: "lessonList"  // 是data（sections）中的属性，作为二级条目
    };

    //定义章节状态信息
    const statusMapping = {
      0: "已隐藏",
      1: "待更新",
      2: "已更新"
    };

    const sectionStatusForm = {
      status: 0
    };
    const lessonStatusForm = {
      status: 0
    };

    return {
      addSectionForm,
      addLessonForm,
      treeProps,
      sections: [],
      sectionStatusForm, //章节状态表单
      lessonStatusForm, // 编辑课时状态表单
      statusMapping,

      loading: false, //树形控件
      showAddSection: false, //添加或修改章节
      showAddLesson: false, // 添加或修改课时
      showSectionStatusForm: false, //章节状态修改
      showLessonStatusForm: false, //章节状态修改
      showEditLessonForm: false //课时状态修改
    };
  },
  created() {
    //1.显示当前页面在网站中的位置
    this.$breadcrumbs = [
      { name: "Courses", text: "课程管理" },
      { text: "课程结构" }
    ];

    //2. 从路由中获取传递的参数, 课程id
    const id = this.$route.params.courseId;
    if (!id) return this.redirectToError();

    //3.加载课程信息
    this.loadCourse(id);

    //4.加载课程对应的章节与课时
    this.loadChildren(id);
  },
  methods: {
    //方法1: 加载课程信息
    loadCourse(id) {
      axios
        .get("/courseContent", {
          params: {
            methodName: "findCourseById",
            course_id: id
          }
        })
        .then(res => {
          //将数据保存到表单对象中
          this.addSectionForm.course_id = res.data.id;
          this.addSectionForm.course_name = res.data.course_name;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("数据获取失败! ! !");
        });
    },

    //方法2: 加载树(章节与课程)
    loadChildren(id) {
      this.loading = true;
      axios
        .get("/courseContent", {
          params: {
            methodName: "findSectionAndLessonByCourseId",
            course_id: id
          }
        })
        .then(resp => {
          //获取章节数据,保存到sections
          this.sections = resp.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("数据获取失败! ! !");
        });
    },

    //方法3: 显示添加章节表单,回显课程信息
    handleShowAddSection() {
      // 这一步会删除addSectionForm中其他属性，相当于清空添加章节弹窗的填写的信息
      // 只保留两个属性
      this.addSectionForm = {
        course_id: this.addSectionForm.course_id,
        course_name: this.addSectionForm.course_name
      };

      //显示表单
      this.showAddSection = true;
    },

    //方法4: 添加&修改章节操作
    handleAddSection() {
      // console.log(this.addSectionForm);
      axios
        .post("/courseContent", {
          methodName: "saveOrUpdateSection",
          section: this.addSectionForm
        })
        .then(resp => {
          this.showAddSection = false;

          //重新加载列表
          this.loadChildren(this.addSectionForm.course_id);
          // this.addSectionForm = {
          //   course_id: this.addSectionForm.course_id,
          //   course_name: this.addSectionForm.course_name
          // };
          // console.log(this.addSectionForm);
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("操作执行失败! ! !");
        });
    },
    //方法5: 修改章节回显方法
    handleEditSection(section) {
      Object.assign(this.addSectionForm, section);
      console.log(section);
      this.showAddSection = true;
    },
    //方法6: 显示章节状态
    showSectionStatus(data) {
      this.sectionStatusForm.id = data.id;
      this.sectionStatusForm.status = data.status.toString();
      this.sectionStatusForm.data = data;
      this.showSectionStatusForm = true;
    },
    //方法7: 修改章节状态
    updateSectionStatus(sectionStatusForm) {
      axios
        .get("/courseContent", {
          params: {
            methodName: "updateSectionStatus",
            status: this.sectionStatusForm.status,
            id: this.sectionStatusForm.id
          }
        })
        .then(resp => {
          this.sectionStatusForm.data.status = this.sectionStatusForm.status;
          this.sectionStatusForm = {};
          this.showSectionStatusForm = false;
        })
        .catch(error => {
          this.showSectionStatusForm = false;
          this.$message.error("修改状态失败! ! !");
        });
    },
    // 方法8：添加课时弹窗
    handleShowAddLesson(data) {
      // this.addLessonForm.course_name = this.addSectionForm.course_name;
      // this.addLessonForm.section_name = data.section_name;
      // this.addLessonForm.course_id = data.course_id;
      // this.addLessonForm.section_id = data.id;

      this.addLessonForm = {
        course_name: this.addSectionForm.course_name,
        section_name: data.section_name,
        course_id: data.course_id,
        section_id: data.id
      }

      // console.log("is_free" + this.addLessonForm.is_free);
      this.showAddLesson = true;

      console.log('添加课时');
      console.log(data);
    },
    handleAddLesson() {
      console.log(this.addLessonForm);
      axios.post("/courseContent", {
        methodName: "saveOrUpdateLesson",
        lesson: this.addLessonForm
      }).then(resp => {
        this.showAddLesson = false;

        return this.loadChildren(this.addLessonForm.course_id);
      }).catch(error => {
        this.loading = false;
        this.$message.error("操作失败执行失败！");
      });
    },
    handleEditLesson(lesson, node) {

      Object.assign(this.addLessonForm, lesson);
      this.addLessonForm.course_name = node.parent.data.course_name;
      this.addLessonForm.section_name = node.parent.data.section_name;
      this.addLessonForm.section_id = node.parent.data.id;

      this.showAddLesson = true;
    },
    //方法9: 显示课时状态
    showLessonStatus(data) {
      console.log(data);
      this.lessonStatusForm.id = data.id;
      this.lessonStatusForm.status = data.status.toString();
      this.lessonStatusForm.data = data;
      this.showLessonStatusForm = true;

      // console.log(this.LessonStatusForm.data);
      
    },
     //方法7: 修改章节状态
    updateLessonStatus(lessonStatusForm) {
      axios
        .get("/courseContent", {
          params: {
            methodName: "updateLessonStatus",
            status: this.lessonStatusForm.status,
            id: this.lessonStatusForm.id
          }
        })
        .then(resp => {
          this.lessonStatusForm.data.status = this.lessonStatusForm.status;
          this.lessonStatusForm = {};
          this.showLessonStatusForm = false;
        })
        .catch(error => {
          this.showLessonStatusForm = false;
          this.$message.error("修改状态失败! ! !");
        });
    },

    uploadVideo(data) {
      console.log('上传视频');
      console.log(data);
    },
    //跳转到错误页面
    redirectToError() {
      this.$router.replace({ path: "/not-found" });
    }
  }
};
</script>

<style lang="scss">
.course-tasks {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-tree {
    margin-top: 20px;
  }

  .el-tree,
  .el-tree__empty-block {
    min-height: 200px;
  }

  .el-tree-node__content {
    height: auto;
  }

  .inner {
    display: flex;
    flex: 1 0 0;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .actions {
    margin-left: auto;
  }
}
</style>
