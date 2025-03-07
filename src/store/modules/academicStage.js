
import { listData, getData, getDicts} from '@/api/system/dict/data'
const useAcademicStageStore = defineStore(
    'academicStage',
    {
        state: () => ({
            id: '',
            academicStageList: [],
            isShowDialog: false//默认不弹框
        }),
        actions: {
            //获取学段列表
            getAcademicStageList() {
                return new Promise((resolve, reject) => {
                    getDicts('mt_academic_stage').then(res => {

                        if(res.code === 200) {
                            this.academicStageList = res.data
                            
                            resolve()
                        }
                        
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            //获取是否显示弹框
            getIsShowDialog(isShowDialog) {
                return this.isShowDialog = isShowDialog
            },
            //存选择的学段
            selectAcademicStage(id) {
                return new Promise((resolve, reject) => {
                    getDicts('mt_school_subject').then(res => {
                        this.academicStageList = res.data
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
        }
    })

export default useAcademicStageStore
