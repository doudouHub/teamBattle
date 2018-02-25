<template>
    <div class="edit-container breakBrick noselect">
        <!--  打砖块出题  -->
        <el-form :model="formData" ref="formData" label-width="100px">
            <el-form-item label="标题">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="正确答案">
                <div class="tag-box">
                    <el-tag
                        :key="tag"
                        v-for="tag in formData.answerTags.list"
                        closable
                        :disable-transitions="true"
                        type="success"
                        @close="deleteThisTag('answerTags',tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="formData.answerTags.inputVisible"
                        v-model="formData.answerTags.inputValue"
                        ref="answerTags"
                        size="small"
                        @keyup.enter.native="createNewTag('answerTags')"
                        @blur="recoverTagButton('answerTags')"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showTagInput('answerTags')">
                        + New Tag
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="混淆选项">
                <div class="tag-box">
                    <el-tag
                        :key="tag"
                        v-for="tag in formData.interferenceTags.list"
                        closable
                        :disable-transitions="true"
                        type="warning"
                        @close="deleteThisTag('interferenceTags',tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="formData.interferenceTags.inputVisible"
                        v-model="formData.interferenceTags.inputValue"
                        ref="interferenceTags"
                        size="small"
                        @keyup.enter.native="createNewTag('interferenceTags')"
                        @blur="recoverTagButton('interferenceTags')"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showTagInput('interferenceTags')">+
                        New Tag
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="掉落速度">
                <el-input
                    v-model="formData.speed"
                    style="width: 200px;"
                    @keyup.native="upsetTaglist"
                    :maxlength="2">
                    <template slot="append">秒/每块</template>
                </el-input>
            </el-form-item>
            <el-form-item label="掉落密度">
                <el-radio-group v-model="formData.density" size="medium" @change="selectDensity">
                    <el-radio-button label="3">稀疏</el-radio-button>
                    <el-radio-button label="5">普通</el-radio-button>
                    <el-radio-button label="7">密集</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="总时长">
                <h3 style="margin: 0;line-height: 40px;">{{formData.total_time}}秒</h3>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                formData: {
                    title: '',
                    speed: 10,
                    density: 3,
                    total_time: 0,
                    answerTags: {
                        list: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79],
                        inputVisible: false,
                        inputValue: ''
                    },
                    interferenceTags: {
                        list: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 48, 44, 46, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72],
                        inputVisible: false,
                        inputValue: ''
                    }
                },
                // 所有标签格式化后的合集
                allTagList: []
            }
        },
        mounted () {
            // 初始化数据 - 打乱现有标签排列
            this.upsetTaglist();
        },
        methods: {
            // 提交表单
            submitForm (formName) {
                this.upsetTaglist();
            },
            // 选择掉落密度
            selectDensity (val) {
                this.formData.density = val;
                this.upsetTaglist();
            },
            // 打乱标签排列
            upsetTaglist () {
                let [_answerTags, _interferenceTags] = [[], []];
                // 为所有砖块绑定答案
                for (let i in this.formData.answerTags.list) {
                    _answerTags.push({
                        title: this.formData.answerTags.list[i],
                        prop: true
                    })
                }
                for (let j in this.formData.interferenceTags.list) {
                    _interferenceTags.push({
                        title: this.formData.interferenceTags.list[j],
                        prop: false
                    })
                }
                // 所有砖块合并
                let allTagList = _answerTags.concat(_interferenceTags);

                allTagList.sort(() => {
                    return 0.5 - Math.random()
                });

                // 速度差异值
                let _speed_diff = 5;
                // 最大速度和最小速度
                let [speed_max, speed_min] = [Number(this.formData.speed) + _speed_diff, this.formData.speed - _speed_diff];
                // id 延迟 位置倍数
                let [_id, _delay, posTimes] = [1, 1, [0, 1, 2, 4, 5, 6, 7]];
                let _delay_max = 1;

                posTimes.sort(() => {
                    return 0.5 - Math.random()
                });
                let posIndex = 0;
                // 添加随机播放逻辑
                for (let i = 0; i < allTagList.length; i++) {
                    // 当循环至下一节点
                    if (i && (i + 1) % this.formData.density === 0) {
                        // 如果当前处于下一排 以为单位做延迟叠加
                        _delay = parseInt(((i + 1) / this.formData.density) * (Number(this.formData.speed) / 1.5));
                        posIndex = 0;
                        // 打乱位置倍数排序
                        posTimes.sort(() => {
                            return 0.5 - Math.random()
                        })
                    }

                    // 存储最大延迟
                    _delay_max = (_delay + getMedianRandom(1, -1)) > _delay_max ? (_delay + getMedianRandom(1, -1)) : _delay_max;

                    allTagList[i] = {
                        id: _id++,
                        // 位置倍数
                        posTimes: posTimes[posIndex++],
                        // 正位偏移
                        margin: getMedianRandom(20, -20),
                        // 下落延迟
                        delay: _delay + getMedianRandom(1, -1),
                        // 获取随机对应速度
                        speed: getMedianRandom(speed_max, speed_min),
                        title: allTagList[i].title,
                        // 当前对错
                        prop: allTagList[i].prop
                    }
                }

                // 总时间 = 基本速度 + 最大延迟
                this.formData.total_time = Math.ceil(Number(this.formData.speed) + _delay_max);
                this.allTagList = allTagList;

                // 获取中间随机值
                function getMedianRandom (max, min) {
                    return Math.round((Math.random() * (max - min) + min) * 100) / 100
                }

                console.log(JSON.stringify(allTagList));
            },
            // 删除当前标签
            deleteThisTag (type, tag) {
                this.formData[type].list.splice(this.formData[type].list.indexOf(tag), 1);
                this.upsetTaglist();
            },
            // 显示标签输入框
            showTagInput (type) {
                this.formData[type].inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs[type].$refs.input.focus();
                });
            },
            // 新建新标签
            createNewTag (type) {
                let inputValue = this.formData[type].inputValue;
                if (inputValue) {
                    this.formData[type].list.push(inputValue);
                }
                this.formData[type].inputValue = '';
                this.upsetTaglist();
            },
            // 失去焦点恢复创建标签button
            recoverTagButton (type) {
                this.createNewTag(type);
                this.formData[type].inputVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .edit-container {
        width: 660px;
        margin: 0 auto;
        .tag-box {
            padding: 10px 15px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
        }
    }
</style>

<style lang="scss">
    .breakBrick {
        .el-form-item__label {
            font-size: 16px;
        }
        .el-form-item__content {
            line-height: normal;
        }
        .tag-box {
            .el-tag {
                margin: {
                    right: 10px;
                    bottom: 10px;
                }
                :last-child {
                    margin-right: 5px;
                }
            }
            .input-new-tag {
                width: 95px;
            }
        }
    }
</style>
