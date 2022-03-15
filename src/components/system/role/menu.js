export default [
    {
        'id': 'ccs-index',
        'parentId': null,
        'label': '首页',
        'sort': 1,
        'children': [{
            'id': 'ccs-index-manager',
            'parentId': 'ccs-index',
            'label': '首页展示',
            'sort': 1,
            'children': [{
                'id': 'ccs-index-scan',
                'parentId': 'ccs-index-manager',
                'label': '首页查看',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }],
        'leaf': false
    },
    {
        'id': 'ccs-monitor-center',
        'parentId': null,
        'label': '监控中心',
        'sort': 2,
        'children': [
            {
                'id': 'ccs-warehouse-manager',
                'parentId': 'ccs-monitor-center',
                'label': '仓库监控',
                'sort': 1,
                'children': [
                    {
                        'id': 'ccs-point-warehouse-dev-rulecfg',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '配置点位设备规则',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },{
                        'id': 'ccs-point-logistics-center-add',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '添加物流中心',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-logistics-center-edit',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '修改物流中心',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-add',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '添加仓库',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-edit',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '修改仓库',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },{
                        'id': 'ccs-point-warehouse-area-add',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '添加库区',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-area-edit',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '编辑库区',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },{
                        'id': 'ccs-point-warehouse-dev-add',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '新增监控点位',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-dev-edit',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '编辑监控点位',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-dev-delete',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '删除监控点位',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-scan',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '查看监控点位',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-dev-bind',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '点位绑定设备',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-warehouse-dev-switch',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '激活关闭库区设备状态',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-warehouse-export',
                        'parentId': 'ccs-warehouse-manager',
                        'label': '导出库区',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }
                ],
                'leaf': false
            },
            {
                'id': 'ccs-transorder-manager',
                'parentId': 'ccs-monitor-center',
                'label': '运单监控',
                'sort': 2,
                'children': [{
                    'id': 'ccs-transorder-export',
                    'parentId': 'ccs-transorder-manager',
                    'label': '导出温度计记录',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-transorder-edit',
                    'parentId': 'ccs-transorder-manager',
                    'label': '修改运单',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-transorder-switch',
                    'parentId': 'ccs-transorder-manager',
                    'label': '激活关闭监控设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-transorder-rulecfg',
                    'parentId': 'ccs-transorder-manager',
                    'label': '配置运单规则',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-transorder-scan',
                    'parentId': 'ccs-transorder-manager',
                    'label': '查看运单',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-point-relation-manager',
                'parentId': 'ccs-monitor-center',
                'label': '点位设备绑定记录',
                'sort': 3,
                'children': [{
                    'id': 'ccs-point-relation-scan',
                    'parentId': 'ccs-point-relation-manager',
                    'label': '查看点位设备绑定记录',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-point-relation-audit',
                    'parentId': 'ccs-point-relation-manager',
                    'label': '审核点位设备绑定记录',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-point-relation-delete',
                    'parentId': 'ccs-point-relation-manager',
                    'label': '删除点位设备绑定记录',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-monitordev-manager',
                'parentId': 'ccs-monitor-center',
                'label': '设备监控',
                'sort': 4,
                'children': [{
                    'id': 'ccs-monitordev-del',
                    'parentId': 'ccs-monitordev-manager',
                    'label': '删除监控设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-monitordev-scan',
                    'parentId': 'ccs-monitordev-manager',
                    'label': '查看监控设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-monitordev-switch',
                    'parentId': 'ccs-monitordev-manager',
                    'label': '激活关闭监控设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-monitordev-rulecfg',
                    'parentId': 'ccs-monitordev-manager',
                    'label': '配置监控设备规则',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-monitordev-edit',
                    'parentId': 'ccs-monitordev-manager',
                    'label': '修改监控设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-monitordev-add',
                    'parentId': 'ccs-monitordev-manager',
                    'label': '添加监控设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-hotmonitor-manager',
                'parentId': 'ccs-monitor-center',
                'label': '货主热点监控',
                'sort': 5,
                'children': [{
                    'id': 'ccs-hotmonitor-del',
                    'parentId': 'ccs-hotmonitor-manager',
                    'label': '删除货主热点监控',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-hotmonitor-scan',
                    'parentId': 'ccs-hotmonitor-manager',
                    'label': '查看货主热点监控',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-hotpints-history-scan',
                    'parentId': 'ccs-hotmonitor-manager',
                    'label': '查看历史数据',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-hotmonitor-add',
                    'parentId': 'ccs-hotmonitor-manager',
                    'label': '添加货主热点监控',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-hotmonitor-rulecfg',
                    'parentId': 'ccs-hotmonitor-manager',
                    'label': '配置货主热点监控规则',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-hotmonitor-switch',
                    'parentId': 'ccs-hotmonitor-manager',
                    'label': '激活关闭货主热点监控',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-point-devdata-manager',
                'parentId': 'ccs-monitor-center',
                'label': '数据查询',
                'sort': 6,
                'children': [
                    // 查询点位历史数据
                    {
                        'id': 'ccs-point-devdata-scan',
                        'parentId': 'ccs-point-devdata-manager',
                        'label': '查看点位历史数据',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        'id': 'ccs-point-devdata-export',
                        'parentId': 'ccs-point-devdata-manager',
                        'label': '导出点位历史数据',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },



                    //查询交接数据
                    {
                        'id': 'ccs-dev-handover-data-scan',
                        'parentId': 'ccs-point-devdata-manager',
                        'label': '查看设备交接数据',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },



                    // 查询历史数据
                    {
                        'id': 'ccs-devdata-export',
                        'parentId': 'ccs-point-devdata-manager',
                        'label': '导出设备数据',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },
                    {
                        'id': 'ccs-devdata-scan',
                        'parentId': 'ccs-point-devdata-manager',
                        'label': '查看设备数据',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },


                    // 导出历史数据
                    {
                        'id': 'ccs-dataexport-export',
                        'parentId': 'ccs-point-devdata-manager',
                        'label': '导出设备数据',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }, {
                        id: 'warehouse-cold-dev-data-export',
                        label: '2-8℃导出'
                    }, {
                        id: 'warehouse-freeze-dev-data-export',
                        label: '-20℃导出'
                    }




                ],
                'leaf': false
            },
            {
                'id': 'ccs-devmap-manager',
                'parentId': 'ccs-monitor-center',
                'label': '静态场景',
                'sort': 7,
                'children': [{
                    'id': 'ccs-org-devmap-authorized',
                    'parentId': 'ccs-devmap-manager',
                    'label': '授权单位设备分布',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-warehouse-dev-edit',
                    'parentId': 'ccs-devmap-manager',
                    'label': '编辑库区设备位置',
                    'sort': null,
                    'children': null,
                    'leaf': true
                },  {
                    'id': 'ccs-warehouse-dev-update',
                    'parentId': 'ccs-devmap-manager',
                    'label': '修改仓库设备分布图',
                    'sort': null,
                    'children': null,
                    'leaf': true
                },{
                    'id': 'ccs-devmap-scan',
                    'parentId': 'ccs-devmap-manager',
                    'label': '查看设备分布',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-org-devmap-scan',
                'parentId': 'ccs-monitor-center',
                'label': '单位设备分布',
                'sort': 8,
                'leaf': false
            },
            {
                'id': 'ccs-dynamic-scene',
                'parentId': 'ccs-monitor-center',
                'label': '动态场景',
                'sort': 9,
                'leaf': false
            },
            {
                'id': 'ccs-scene-configuration',
                'parentId': 'ccs-monitor-center',
                'label': '场景配置',
                'sort': 10,
                'children': [
                    /*
                        屏蔽掉功能
                        {
                            'id': 'ccs-point-dev-binding',
                            'parentId': 'ccs-scene-configuration',
                            'label': '绑定规则',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                        {
                            'id': 'ccs-point-rule-binding',
                            'parentId': 'ccs-scene-configuration',
                            'label': '绑定设备',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                        {
                            'id': 'ccs-object-management-del',
                            'parentId': 'ccs-scene-configuration',
                            'label': '删除对象',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                        {
                            'id': 'ccs-point-configuration-del',
                            'parentId': 'ccs-scene-configuration',
                            'label': '删除点位',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                        {
                            'id': 'ccs-object-management-edit',
                            'parentId': 'ccs-scene-configuration',
                            'label': '保存对象',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                        {
                            'id': 'ccs-point-configuration-edit',
                            'parentId': 'ccs-scene-configuration',
                            'label': '保存点位',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                    */

                    {
                        'id': 'ccs-scene-object-binding',
                        'parentId': 'ccs-scene-configuration',
                        'label': '绑定对象',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },
                    {
                        'id': 'ccs-scene-configuration-add',
                        'parentId': 'ccs-scene-configuration',
                        'label': '添加场景',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },
                    {
                        'id': 'ccs-scene-configuration-del',
                        'parentId': 'ccs-scene-configuration',
                        'label': '删除场景',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },


                    {
                        'id': 'ccs-scene-configuration-edit',
                        'parentId': 'ccs-scene-configuration',
                        'label': '保存场景',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }


                ],
                'leaf': false
            },
            {
                'id': 'ccs-object-management',
                'parentId': 'ccs-monitor-center',
                'label': '对象配置',
                'sort': 11,
                'children': [
                    {
                        'id': 'ccs-object-management-add',
                        'parentId': 'ccs-object-management',
                        'label': '添加对象',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },

                    /*
                        // 对象配置中没有场景功能 屏蔽掉
                        {
                            'id': 'ccs-wscene-configuration-del',
                            'parentId': 'ccs-object-management',
                            'label': '删除场景',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },

                        {
                            'id': 'ccs-scene-configuration-edit',
                            'parentId': 'ccs-object-management',
                            'label': '保存场景',
                            'sort': null,
                            'children': null,
                            'leaf': true
                        },
                    */

                    {
                        'id': 'ccs-object-management-del',
                        'parentId': 'ccs-object-management',
                        'label': '删除对象',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },
                    {
                        'id': 'ccs-point-configuration-del',
                        'parentId': 'ccs-object-management',
                        'label': '删除点位',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },

                    {
                        'id': 'ccs-object-management-edit',
                        'parentId': 'ccs-object-management',
                        'label': '保存对象',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    },
                    {
                        'id': 'ccs-point-configuration-edit',
                        'parentId': 'ccs-object-management',
                        'label': '保存点位',
                        'sort': null,
                        'children': null,
                        'leaf': true
                    }


                ],
                'leaf': false
            }


            // {
            //     'id': 'ccs-point-manager',
            //     'parentId': 'ccs-monitor-center',
            //     'label': '点位监控',
            //     'sort': 1,
            //     'children': [{
            //         'id': 'ccs-point-warehouse-dev-rulecfg',
            //         'parentId': 'ccs-point-manager',
            //         'label': '配置点位设备规则',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     },{
            //         'id': 'ccs-point-logistics-center-add',
            //         'parentId': 'ccs-point-manager',
            //         'label': '添加物流中心',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-logistics-center-edit',
            //         'parentId': 'ccs-point-manager',
            //         'label': '修改物流中心',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-add',
            //         'parentId': 'ccs-point-manager',
            //         'label': '添加仓库',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-edit',
            //         'parentId': 'ccs-point-manager',
            //         'label': '修改仓库',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     },{
            //         'id': 'ccs-point-warehouse-area-add',
            //         'parentId': 'ccs-point-manager',
            //         'label': '添加库区',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-area-edit',
            //         'parentId': 'ccs-point-manager',
            //         'label': '编辑库区',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     },{
            //         'id': 'ccs-point-warehouse-dev-add',
            //         'parentId': 'ccs-point-manager',
            //         'label': '新增监控点位',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-dev-edit',
            //         'parentId': 'ccs-point-manager',
            //         'label': '编辑监控点位',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-dev-delete',
            //         'parentId': 'ccs-point-manager',
            //         'label': '删除监控点位',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-scan',
            //         'parentId': 'ccs-point-manager',
            //         'label': '查看监控点位',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-dev-bind',
            //         'parentId': 'ccs-point-manager',
            //         'label': '点位绑定设备',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-point-warehouse-dev-switch',
            //         'parentId': 'ccs-point-manager',
            //         'label': '激活关闭库区设备状态',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }],
            //     'leaf': false
            // },


            // {
            //     'id': 'ccs-devdata-manager',
            //     'parentId': 'ccs-monitor-center',
            //     'label': '查询设备数据',
            //     'sort': 5,
            //     'children': [{
            //         'id': 'ccs-devdata-scan',
            //         'parentId': 'ccs-devdata-manager',
            //         'label': '查看设备数据',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         'id': 'ccs-devdata-export',
            //         'parentId': 'ccs-devdata-manager',
            //         'label': '导出设备数据',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }],
            //     'leaf': false
            // },

            // {
            //     'id': 'ccs-dataexport-manager',
            //     'parentId': 'ccs-monitor-center',
            //     'label': '导出设备数据',
            //     'sort': 5,
            //     'children': [{
            //         'id': 'ccs-dataexport-export',
            //         'parentId': 'ccs-dataexport-manager',
            //         'label': '导出设备数据',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }, {
            //         id: 'warehouse-cold-dev-data-export',
            //         label: '2-8℃导出'
            //     }, {
            //         id: 'warehouse-freeze-dev-data-export',
            //         label: '-20℃导出'
            //     }],
            //     'leaf': false
            // },

            // {
            //     'id': 'ccs-dev-handover-data-manager',
            //     'parentId': 'ccs-monitor-center',
            //     'label': '查询交接数据',
            //     'sort': 5,
            //     'children': [{
            //         'id': 'ccs-dev-handover-data-scan',
            //         'parentId': 'ccs-dev-handover-data-manager',
            //         'label': '查看设备交接数据',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }],
            //     'leaf': false
            // },
            // {
            //     'id': 'ccs-carmap-manager',
            //     'parentId': 'ccs-monitor-center',
            //     'label': '车辆分布',
            //     'sort': 7,
            //     'children': [{
            //         'id': 'ccs-carmap-scan',
            //         'parentId': 'ccs-carmap-manager',
            //         'label': '查看车辆分布',
            //         'sort': null,
            //         'children': null,
            //         'leaf': true
            //     }],
            //     'leaf': false
            // },

        ],
        'leaf': false
    },
    {
        'id': 'ccs-warn-center',
        'parentId': null,
        'label': '告警中心',
        'sort': 3,
        'children': [
            {
                'id': 'ccs-warn-record-manager',
                'parentId': 'ccs-warn-center',
                'label': '告警事件',
                'sort': 1,
                'children': [{
                    'id': 'ccs-warn-record-process',
                    'parentId': 'ccs-warn-record-manager',
                    'label': '处理告警事件',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-warn-record-scan',
                    'parentId': 'ccs-warn-record-manager',
                    'label': '查看告警事件',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-warn-notify-manager',
                'parentId': 'ccs-warn-center',
                'label': '告警通知',
                'sort': 2,
                'children': [{
                    'id': 'ccs-warn-notify-scan',
                    'parentId': 'ccs-warn-notify-manager',
                    'label': '查看告警通知',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            }],
        'leaf': false
    },
    {
        'id': 'ccs-dev-center',
        'parentId': null,
        'label': '设备资产',
        'sort': 4,
        'children': [
            {
                'id': 'ccs-wired-dev-export',
                'parentId': 'ccs-dev-center',
                'label': '设备资产导出',
                'sort': 1,
                'children': null,
                'leaf': true
            },
            {
                'id': 'ccs-car-dev-manager',
                'parentId': 'ccs-dev-center',
                'label': '车载温度计',
                'sort': 4,
                'children': [{
                    'id': 'ccs-car-dev-scan',
                    'parentId': 'ccs-car-dev-manager',
                    'label': '查看车载温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-car-dev-edit',
                    'parentId': 'ccs-car-dev-manager',
                    'label': '修改车载温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-car-dev-add',
                    'parentId': 'ccs-car-dev-manager',
                    'label': '添加车载温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-hotmonitor-manager',
                'parentId': 'ccs-dev-center',
                'label': '产品一览',
                'sort': 6,
                'children': [{
                    'id': 'ccs-cool-dev-add',
                    'parentId': 'ccs-cool-dev-manager',
                    'label': '修改产品',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-cool-dev-scan',
                    'parentId': 'ccs-cool-dev-manager',
                    'label': '查看产品详情',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-cool-dev-edit',
                    'parentId': 'ccs-cool-dev-manager',
                    'label': '添加产品',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-wired-all-dev',
                'parentId': 'ccs-dev-center',
                'label': '所有设备',
                'sort': 1,
                'children': [{
                    'id': 'ccs-wired-edit-all-dev',
                    'parentId': 'ccs-wired-all-dev',
                    'label': '编辑所有设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-wired-watch-all-dev',
                    'parentId': 'ccs-wired-all-dev',
                    'label': '查看所有设备',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-wifi-dev-manager',
                'parentId': 'ccs-dev-center',
                'label': '无线温度计',
                'sort': 2,
                'children': [{
                    'id': 'ccs-wifi-dev-scan',
                    'parentId': 'ccs-wifi-dev-manager',
                    'label': '查看无线温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-wifi-dev-add',
                    'parentId': 'ccs-wifi-dev-manager',
                    'label': '添加无线温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-wifi-dev-edit',
                    'parentId': 'ccs-wifi-dev-manager',
                    'label': '修改无线温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-cool-dev-manager',
                'parentId': 'ccs-dev-center',
                'label': '冷柜温度计',
                'sort': 3,
                'children': [{
                    'id': 'ccs-cool-dev-add',
                    'parentId': 'ccs-cool-dev-manager',
                    'label': '添加冷柜温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-cool-dev-scan',
                    'parentId': 'ccs-cool-dev-manager',
                    'label': '查看冷柜温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-cool-dev-edit',
                    'parentId': 'ccs-cool-dev-manager',
                    'label': '修改冷柜温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-humidity-dev-manager',
                'parentId': 'ccs-dev-center',
                'label': '湿度计',
                'sort': 5,
                'children': [{
                    'id': 'ccs-humidity-dev-edit',
                    'parentId': 'ccs-humidity-dev-manager',
                    'label': '修改湿度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-humidity-dev-add',
                    'parentId': 'ccs-humidity-dev-manager',
                    'label': '添加湿度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-humidity-dev-scan',
                    'parentId': 'ccs-humidity-dev-manager',
                    'label': '查看湿度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-wired-dev-manager',
                'parentId': 'ccs-dev-center',
                'label': '有线温度计',
                'sort': 1,
                'children': [{
                    'id': 'ccs-wired-dev-add',
                    'parentId': 'ccs-wired-dev-manager',
                    'label': '添加有线温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-wired-dev-scan',
                    'parentId': 'ccs-wired-dev-manager',
                    'label': '查看有线温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }, {
                    'id': 'ccs-wired-dev-edit',
                    'parentId': 'ccs-wired-dev-manager',
                    'label': '修改有线温度计',
                    'sort': null,
                    'children': null,
                    'leaf': true
                }],
                'leaf': false
            },
            {
                'id': 'ccs-dev-import-add',
                'parentId': 'ccs-wired-dev-manager',
                'label': '批量新增设备',
                'sort': null,
                'children': null,
                'leaf': true
            },
            {
                'id': 'ccs-dev-import-update',
                'parentId': 'ccs-wired-dev-manager',
                'label': '批量编辑设备',
                'sort': null,
                'children': null,
                'leaf': true
            }
        ],
        'leaf': false
    },
    {
        'id': 'ccs-config-center',
        'parentId': null,
        'label': '配置中心',
        'sort': 5,
        'children': [{
            'id': 'ccs-warn-rule-group-manager',
            'parentId': 'ccs-config-center',
            'label': '告警规则组',
            'sort': 1,
            'children': [{
                'id': 'ccs-warn-rule-group-del',
                'parentId': 'ccs-warn-rule-group-manager',
                'label': '删除告警规则组',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-warn-rule-group-edit',
                'parentId': 'ccs-warn-rule-group-manager',
                'label': '修改告警规则组',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-warn-rule-group-add',
                'parentId': 'ccs-warn-rule-group-manager',
                'label': '添加告警规则组',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-warn-rule-group-scan',
                'parentId': 'ccs-warn-rule-group-manager',
                'label': '查看告警规则组',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }, {
            'id': 'ccs-warn-rule-manager',
            'parentId': 'ccs-config-center',
            'label': '告警规则',
            'sort': 2,
            'children': [{
                'id': 'ccs-warn-rule-del',
                'parentId': 'ccs-warn-rule-manager',
                'label': '删除告警规则',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-warn-rule-edit',
                'parentId': 'ccs-warn-rule-manager',
                'label': '修改告警规则',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-warn-rule-add',
                'parentId': 'ccs-warn-rule-manager',
                'label': '添加告警规则',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-warn-rule-scan',
                'parentId': 'ccs-warn-rule-manager',
                'label': '查看告警规则',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }, {
            'id': 'ccs-notify-manager',
            'parentId': 'ccs-config-center',
            'label': '通知列表',
            'sort': 3,
            'children': [{
                'id': 'ccs-notify-edit',
                'parentId': 'ccs-notify-manager',
                'label': '修改通知列表',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-notify-del',
                'parentId': 'ccs-notify-manager',
                'label': '删除通知列表',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-notify-scan',
                'parentId': 'ccs-notify-manager',
                'label': '查看通知列表',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-notify-add',
                'parentId': 'ccs-notify-manager',
                'label': '添加通知列表',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }],
        'leaf': false
    },
    {
        'id': 'system-config',
        'parentId': null,
        'label': '系统设置',
        'sort': 6,
        'children': [{
            'id': 'ccs-system-log',
            'parentId': 'ccs-system-config',
            'label': '系统日志',
            'sort': 4,
            'children': null,
            'leaf': true
        }, {
            'id': 'ccs-attachment-name-update',
            'parentId': 'ccs-system-config',
            'label': '编辑附件名称',
            'sort': 5,
            'children': null,
            'leaf': true
        }, {
            'id': 'ccs-platform-user-manager',
            'parentId': 'ccs-system-config',
            'label': '平台用户管理',
            'sort': 1,
            'children': [{
                'id': 'ccs-department-delete',
                'parentId': 'ccs-platform-user-manager',
                'label': '删除部门',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-department-add',
                'parentId': 'ccs-platform-user-manager',
                'label': '新增部门',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-department-edit',
                'parentId': 'ccs-platform-user-manager',
                'label': '编辑部门',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-platform-user-edit',
                'parentId': 'ccs-platform-user-manager',
                'label': '编辑平台用户',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-platform-user-add',
                'parentId': 'ccs-platform-user-manager',
                'label': '新增平台用户',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-platform-user-watch',
                'parentId': 'ccs-platform-user-manager',
                'label': '查看平台用户',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }, {
            'id': 'access-role-manager',
            'parentId': 'ccs-system-config',
            'label': '角色管理',
            'sort': 2,
            'children': [{
                'id': 'access-role-watch',
                'parentId': 'ccs-user-role-manager',
                'label': '查看角色',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-access-role-stop',
                'parentId': 'ccs-user-role-manager',
                'label': '停用角色',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-access-role-start',
                'parentId': 'ccs-user-role-manager',
                'label': '启用角色',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'access-role-edit',
                'parentId': 'ccs-user-role-manager',
                'label': '编辑角色',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-access-role-delete',
                'parentId': 'ccs-user-role-manager',
                'label': '删除角色',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'access-role-add',
                'parentId': 'ccs-user-role-manager',
                'label': '新增角色',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }, {
            'id': 'ccs-org-user-role-manager',
            'parentId': 'ccs-system-config',
            'label': '单位用户管理',
            'sort': 3,
            'children': [{
                'id': 'ccs-org-user-edit',
                'parentId': 'ccs-org-user-role-manager',
                'label': '编辑单位用户',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-org-user-watch',
                'parentId': 'ccs-org-user-role-manager',
                'label': '查看单位用户',
                'sort': null,
                'children': null,
                'leaf': true
            }, {
                'id': 'ccs-org-user-add',
                'parentId': 'ccs-org-user-role-manager',
                'label': '新增单位用户',
                'sort': null,
                'children': null,
                'leaf': true
            }],
            'leaf': false
        }],
        'leaf': false
    }];
