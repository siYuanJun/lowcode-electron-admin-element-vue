import { Mutation, Action, ActionObject } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { codeModelFieldType, dbFieldsType } from './data.d';


export interface StateType {
    codeModelField: codeModelFieldType,
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        addCodeModelFieldDbFields: Mutation<StateType>;
        removeCodeModelFieldDbFields: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
    };
}

export const dbFields = <dbFieldsType> {
    field_name: '',
    field_title: '',
    field_input_type: '',
    field_type: '',
    field_default_value: '',
    field_indexs: '',
    field_length: 0,

    field_rule: [{
        validation_rules: '',
        validation_detailed: '',
        validation_scene: '',
        validation_alert_text: '',
    }],

    field_association: {
        type: '',
        model_conf: {
            model: '',
            relation_key: '',
            relation_list: []
        },
        field_conf: [{
            key: 0,
            value: '',
            label: ''
        }]
    }
}

export const codeModelField = <codeModelFieldType>{
    id: 0,
    project_info: {
        project_name: '',
        project_id: '',
        project_user_id: '',
    },
    data_conf: {
        db_title: '文章管理',
        db_name: 'info',
        db_model_name: 'info',
        db_controller_name: 'infoController',
        db_controller_dir: '/controller/info',
        db_parent_menu: "",
        db_fields: []
    },
    list_conf: {},
    add_conf: {},
    edit_conf: {},
    other_conf: {},
}

const initState: StateType = {
    codeModelField: codeModelField
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'CodeCreateStore',
    state: {
        ...initState
    },
    mutations: {
        addCodeModelFieldDbFields(state, payload) {
            console.log("添加行", payload)
            state.codeModelField.data_conf.db_fields.push(payload);
        },
        removeCodeModelFieldDbFields(state, payload) {
            console.log("删除行", payload)
            
            state.codeModelField.data_conf.db_fields.splice(payload.index, 1);
        },
    },
    actions: {
        async queryTableData({ commit }, payload: any ) {
            console.log(commit)
        },
    }
};

export default StoreModel;
