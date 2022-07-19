import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//  需要维护的状态
const state = {
    uploadUrl: 'https:// jsonplaceholder.typicode.com/posts/',
    user: {},
    dict: {},
    permissions: [],
    allMenuList: {},
    roleList: {},
    attachmentDialog: {attachmentId: 0, open: false, attachmentList: []},
    dev: {},
    setBodyHeight: 0,
    print: {
        isPrinting: false,
        text: '拼命打印中'
    },
    bodyHeight: 0,
    isShowGoodsList: false,
    bottomLoading: false,
    menuParentIds: [], // 所有非叶子节点菜单
    requestingDictAry: [],
    orgCode: '',
    unitId: '',
    devCode: '',
    findPath: true,
    times: [],
    isShowTemp: false,

    // yxh 用于动态场景状态数据
    elementColumn: {
        depository: {
            value: 1,
            name: '库区',
            first: '',
            second: '',
            third: '',
            fourth: '',
        },
        company: {
            value: 2,
            name: '单位',
            first: '',
            second: '',
            third: '',
            fourth: '',
        },
        car: {
            value: 3,
            name: '车辆',
            first: '',
            second: '',
            third: '',
            fourth: '',
        },
        order: {
            value: 4,
            name: '订单',
            first: '',
            second: '',
            third: '',
            fourth: '',
        },
    },

    statusMap: {
        ONLINE: 'backgroundUrl',
        WARNING: 'backgroundUrlEx',
        OFFLINE: 'backgroundUrlOffline',
        STOP: 'backgroundUrlStop',
    },
    statusDesMap: {
        ONLINE: '在线',
        WARNING: '告警',
        OFFLINE: '离线',
        STOP: '停止',
    },

    


};

const mutations = {
    elementColumn: function (state, data) {
        state.elementColumn = data
    },
    
    initUser: function (state, data) {
        try {
            if (data && data.userId) {
                window.localStorage.setItem('user', JSON.stringify(data));
                state.user = data;
            }
        } catch (e) {

        }
    },
    initCode(state, orgCode) {
        try {
            if (orgCode) {
                window.localStorage.setItem('orgCode', JSON.stringify(orgCode));
                state.orgCode = orgCode;
            }
        } catch (e) {

        }
    },
    initDev(state, data) {
        state.dev = data;
    },
    initDict(state, data) {
        state.dict = data;
    },
    initPermissions(state, data) {
        state.permissions = data;
    },
    initPermList(state, data) {
        state.allMenuList = data;
    },
    changeAttachment(state, data) {
        let currentId;
        if (typeof data === 'object') {
            currentId = data.currentId;
            state.attachmentDialog.attachmentList = data.attachmentList;
        } else {
            currentId = data;
            state.attachmentDialog.attachmentList = [];
        }
        if (state.attachmentDialog.attachmentId === currentId) {
            state.attachmentDialog.open = true;
        } else {
            state.attachmentDialog.attachmentId = currentId;
        }
    },
    closeAttachmentDialog(state) {
        state.attachmentDialog.open = false;
    },
    setBodyHeight(state, data) {
        state.bodyHeight = data;
    },
    initPrint(state, data) {
        data.text = data.text || '拼命打印中';
        state.print = data;
    },
    initIsShowGoodsList(state, data) {
        state.isShowGoodsList = data;
    },
    initMenuParentIds(state, data) {
        state.menuParentIds = data;
    },
    initBottomLoading(state, data) {
        state.bottomLoading = data;
    },
    initRequestingDictAry(state, data) {
        state.requestingDictAry = data;
    },
    initUnitId(state, data) {
        state.unitId = data;
    },
    initDevCode(state, data) {
        state.devCode = data;
    },
    initFindPath(state, data) {
        state.findPath = data;
    },
    initTimes(state, data) {
        state.times = data;
    },
    initShowTemp(state, data) {
        state.isShowTemp = data;
    }
};

export default new Vuex.Store({
    state,
    mutations
});
