<template>
    <div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        <el-radio-group v-model="lesson.is_free" change="change">
            <el-radio :label="1">备选项1</el-radio>
            <el-radio :label="2">备选项2</el-radio>
        </el-radio-group>
        <hr>
        <el-radio v-model="radio" label="1">备选项</el-radio>
        <el-radio v-model="radio" label="1">备选项</el-radio>
    </div>
</template>

<script>
export default {

    data() {

        const lesson = {
            is_free: 2
        };
        return {
            lesson,
            radio: '1',
            data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        change(i){
            console.log(i);
        }


    }
};
</script>

<style>
</style>
