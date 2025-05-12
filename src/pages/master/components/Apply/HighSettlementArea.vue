<template>
  <div
    class="card is-full fifth-card is-expanded"
    id="ApplyFifthCard"
    v-if="!isEmpty(highSettlementData)"
    ref="highSettlementAreaTarget"
  >
    <button class="card-toggle-btn expand"></button>

    <!-- 大額給付 -->
    <h2><cathay-translate code="Component_HighSettlementArea_001"/></h2>

    <div class="part border-none">
      <div class="columns has-flex-column">
        <div class="column">
          <span class="field has-tippy"> <cathay-translate code="Component_HighSettlementArea_002"/></span>
          <EditableDatePicker
            v-model="highSettlementData.CFM_DISB_DATE"
            :schema="
              afterOcrDateSchema.test('required', '不可為空白', (value) => !(hasClamCats(['B', 'C', 'H', 'D', 'J']) && !value))
            "
          ></EditableDatePicker>
        </div>
      </div>
      <template v-if="highSettlementData?.DEATH_DATA">
        <!-- 死亡給付 -->
        <h3>死亡給付</h3>

        <div class="columns has-flex-column">
          <div
            class="column is-half"
            v-if="highSettlementData?.DEATH_DATA?.CFM_DEAD_DATE === '' || highSettlementData?.DEATH_DATA?.CFM_DEAD_DATE"
          >
            <span class="field">身故(完全失能)日期</span>
            <EditableDatePicker
              v-model="highSettlementData.DEATH_DATA.CFM_DEAD_DATE"
              :schema="
                afterOcrDateSchema.test(
                  'required',
                  '索賠類別勾選身故、全殘(A、K)時，不可為空白',
                  (value) => !(hasClamCats(['A', 'K']) && !value)
                )
              "
            ></EditableDatePicker>
          </div>
          <div class="column is-vcentered">
            <span class="field has-tippy">死亡方式</span>
            <div class="columns has-flex-column is-vcentered">
              <div>
                <EditableDropdown
                  :editingWidth="170"
                  v-model="highSettlementData.DEATH_DATA.CFM_DEAD_TYPE"
                  :schema="deathDateRequiredSchema"
                  :options="[
                    {
                      name: '疾病或自然死',
                      value: '1'
                    },
                    {
                      name: '意外死',
                      value: '2'
                    },
                    {
                      name: '自殺',
                      value: '3'
                    },
                    {
                      name: '他殺',
                      value: '4'
                    },
                    {
                      name: '不詳',
                      value: '5'
                    },
                    {
                      name: '未勾選',
                      value: '6'
                    },
                    {
                      name: '其他',
                      value: '7'
                    }
                  ]"
                ></EditableDropdown>
              </div>
              <div class="ml-5">
                <EditableModal
                  v-model:modelText="highSettlementData.DEATH_DATA.CFM_ICD_NAME"
                  v-model:modelValue="highSettlementData.DEATH_DATA.CFM_ICD_CODE"
                  placeholder="請選擇ICD"
                  :schema="deathDateRequiredSchema"
                  :editingWidth="170"
                  :modal="{
                    component: ICDModal,
                    id: 'diseaseCode',
                    data: {}
                  }"
                ></EditableModal>
              </div>
            </div>
          </div>
        </div>
        <div class="columns has-flex-column">
          <div class="column is-half">
            <span class="field">法醫師/檢驗員/醫師姓名</span>
            <EditableInput
              :inputWidth="120"
              :schema="deathDateRequiredSchema"
              v-model="highSettlementData.DEATH_DATA.CFM_DOC_NAME"
            ></EditableInput>
          </div>
          <div class="column is-half">
            <span class="field">證明書開立字號</span>
            <EditableInput
              :inputWidth="200"
              v-model="highSettlementData.DEATH_DATA.CFM_PROV_NO"
              :schema="deathRequiredSchema"
            ></EditableInput>
          </div>
        </div>
        <div class="columns has-flex-column">
          <div class="column is-half">
            <span class="field">檢察官姓名</span>
            <EditableInput :inputWidth="120" v-model="highSettlementData.DEATH_DATA.CFM_PRO_NAME"></EditableInput>
          </div>
          <div class="column is-half">
            <span class="field">證明書開立日期</span>
            <EditableDatePicker
              v-model="highSettlementData.DEATH_DATA.CFM_PROV_DATE"
              :schema="deathDateRequiredSchema"
            ></EditableDatePicker>
          </div>
        </div>
        <div class="columns">
          <div class="column is-half">
            <div class="columns">
              <div class="column is-narrow ver-center">
                <span class="field">死亡地點</span>
              </div>
              <GroupEditable class="p-0">
                <div class="columns has-flex-column">
                  <div class="column is-narrow mx-3">
                    <EditableDropdown
                      v-model="highSettlementData.DEATH_DATA.CFM_DEAD_ADDR1"
                      :editingWidth="110"
                      :options="getDieCityOptions"
                      :schema="deathDateRequiredSchema"
                    ></EditableDropdown>
                  </div>
                  <div class="column is-narrow mx-3">
                    <EditableDropdown
                      v-model="highSettlementData.DEATH_DATA.CFM_DEAD_ADDR2"
                      :watchValue="highSettlementData.DEATH_DATA.CFM_DEAD_ADDR1"
                      :onRefreshOptions="getDieAreaOptions"
                      :editingWidth="120"
                      :options="getDieAreaOptions"
                      :schema="deathDateRequiredSchema"
                    ></EditableDropdown>
                  </div>
                  <div class="column is-narrow mx-3">
                    <EditableDropdown
                      v-model="highSettlementData.DEATH_DATA.CFM_DEAD_ADDR3"
                      :editingWidth="130"
                      :schema="deathDateRequiredSchema"
                      :options="[
                        { name: '醫院', value: '01' },
                        { name: '診所', value: '02' },
                        { name: '長期照護或安養機構', value: '03' },
                        { name: '自宅', value: '04' },
                        { name: '其他', value: '05' }
                      ]"
                    ></EditableDropdown>
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>
          <div class="column is-half ver-center">
            <span class="field">證明書開立醫院/檢察署</span>
            <EditableModal
              v-model:modelText="highSettlementData.DEATH_DATA.CFM_HOSP_NAME"
              v-model:modelValue="highSettlementData.DEATH_DATA.CFM_HOSP_CODE"
              :editingWdith="200"
              :schema="deathDateRequiredSchema"
              :modal="{
                component: HospitalModal,
                id: 'selectHospitalModal',
                data: {}
              }"
            ></EditableModal>
          </div>
        </div>
        <div class="columns">
          <div class="column is-1">
            <span class="field">死亡原因</span>
          </div>
          <div class="column is-11 p-0">
            <div class="columns is-multiline">
              <div class="column is-11 p-0">
                <div class="columns is-align-items-center">
                  <div class="column is-3">
                    <span class="field">1.直接引起死亡之疾病或傷害</span>
                  </div>
                  <GroupEditable class="p-0">
                    <div class="columns is-align-items-center">
                      <div class="column is-narrow mr-2">甲.</div>
                      <div class="column mr-2">
                        <EditableInput
                          :inputWidth="176"
                          :maxWidth="180"
                          v-model="highSettlementData.DEATH_DATA.CFM_DEAD_RESN1A"
                          :schema="deathDateRequiredSchema"
                        ></EditableInput>
                      </div>
                      <div class="column is-narrow mr-2">乙.</div>
                      <div class="column mr-2">
                        <EditableInput
                          :inputWidth="176"
                          :maxWidth="180"
                          v-model="highSettlementData.DEATH_DATA.CFM_DEAD_RESN1B"
                        ></EditableInput>
                      </div>
                      <div class="column is-narrow mr-2">丙.</div>
                      <div class="column mr-2">
                        <EditableInput
                          :inputWidth="176"
                          :maxWidth="180"
                          v-model="highSettlementData.DEATH_DATA.CFM_DEAD_RESN1C"
                        ></EditableInput>
                      </div>
                      <div class="column is-narrow mr-2">丁.</div>
                      <div class="column mr-2">
                        <EditableInput
                          :inputWidth="176"
                          :maxWidth="180"
                          v-model="highSettlementData.DEATH_DATA.CFM_DEAD_RESN1D"
                        ></EditableInput>
                      </div>
                    </div>
                  </GroupEditable>
                </div>
              </div>
              <div class="column is-full is-flex is-align-items-center">
                <span class="field">2.其它對於死亡有影響之疾病或身體狀況：</span>
                <EditableInput v-model="highSettlementData.DEATH_DATA.CFM_DEAD_RESN2" fitContent></EditableInput>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-half">
            <span class="field mr-12">癌症身故</span>
            <EditableCheckbox v-model="highSettlementData.DEATH_DATA.CFM_IS_CNCR"></EditableCheckbox>
          </div>
          <div class="column is-half">
            <span class="field mr-12">癌症完全失能</span>
            <EditableCheckbox v-model="highSettlementData.DEATH_DATA.CFM_FULL_CNCR"></EditableCheckbox>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <span class="field mr-12">員工福團意外特約</span>
            <EditableCheckbox v-model="highSettlementData.DEATH_DATA.CFM_EMP_ACC"></EditableCheckbox>
          </div>
        </div>
      </template>
    </div>

    <div class="hidden-parts">
      <!-- 完全失能項目 -->
      <div class="part" v-if="highSettlementData?.FULLDISB_DATA">
        <h3>完全失能項目</h3>

        <div class="columns has-flex-column">
          <div class="column is-3">
            <span class="field mr-12">完全失能關懷金</span>
            <EditableCheckbox v-model="highSettlementData.FULLDISB_DATA.CFM_FULL_CON"></EditableCheckbox>
          </div>
          <div class="column is-8">
            <span class="field">失能項目</span>
            <EditableModal
              v-model:modelText="highSettlementData.FULLDISB_DATA.CFM_DISB_CAT_NAME"
              v-model:modelValue="highSettlementData.FULLDISB_DATA.CFM_DISB_CAT"
              placeholder="請選擇失能項目"
              :modal="{
                component: FullDisabilityModal,
                id: 'modifyCategoryModal',
                data: {}
              }"
            ></EditableModal>
          </div>
        </div>
      </div>

      <!-- 失能給付 -->
      <div class="part" v-if="highSettlementData?.DISB_DATA">
        <h3>失能給付</h3>

        <div class="columns">
          <div class="column">
            <span class="field mr-12">是否有殘廢裝置</span>
            <EditableCheckbox v-model="highSettlementData.DISB_DATA.CFM_DISB_EQP"></EditableCheckbox>
          </div>
        </div>

        <div class="columns">
          <GroupEditable class="is-full" ref="disbGroup" disableGroupClick>
            <table class="table is-fullwidth apply-table">
              <thead>
                <tr>
                  <th>序號</th>
                  <th>項目</th>
                  <th class="th-hor-center">部位</th>
                  <th class="th-hor-center">左右</th>
                  <th class="th-hor-center">關節</th>
                  <th class="th-hor-center">機能</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(disbItem, index) in showingDisbData" :key="disbItem.DISB_SER_NO">
                  <td class="not-editable">{{ index + 1 }}</td>
                  <td>
                    <EditableDropdown
                      :editingWidth="150"
                      v-model="disbItem.CFM_DISB_CLS"
                      v-model:modelName="disbItem.CFM_DISB_CLS_NAME"
                      nonSelectedText="-"
                      dynamic="opened"
                      :options="[
                        {
                          name: '請選擇',
                          value: ''
                        },
                        {
                          name: disbItem.CFM_DISB_CLS_NAME,
                          value: disbItem.CFM_DISB_CLS,
                          disabled: true
                        }
                      ]"
                      :onRefreshOptions="async () => await getDisbOptions('getDisbClsList')"
                    ></EditableDropdown>
                  </td>
                  <td class="td-hor-center">
                    <EditableDropdown
                      :editingWidth="140"
                      v-model="disbItem.CFM_DISB_PART"
                      v-model:modelName="disbItem.CFM_DISB_PART_NAME"
                      nonSelectedText="-"
                      dynamic="opened"
                      :options="[
                        {
                          name: '請選擇',
                          value: ''
                        },
                        {
                          name: disbItem.CFM_DISB_PART_NAME,
                          value: disbItem.CFM_DISB_PART,
                          disabled: true
                        }
                      ]"
                      :onRefreshOptions="async () => await getDisbOptions('getDisbPartList', disbItem.CFM_DISB_CLS)"
                    ></EditableDropdown>
                  </td>
                  <td class="td-hor-center">
                    <EditableDropdown
                      :editingWidth="120"
                      v-model="disbItem.CFM_DISB_LF"
                      v-model:modelName="disbItem.CFM_DISB_LF_NAME"
                      nonSelectedText="-"
                      :disabled="disbItem.CFM_DISB_CLS === '1'"
                      dynamic="opened"
                      :options="[
                        {
                          name: '請選擇',
                          value: ''
                        },
                        {
                          name: disbItem.CFM_DISB_LF_NAME,
                          value: disbItem.CFM_DISB_LF,
                          disabled: true
                        }
                      ]"
                      :onRefreshOptions="async () => await getDisbOptions('getDisbLFList', disbItem.CFM_DISB_PART)"
                    ></EditableDropdown>
                  </td>
                  <td class="td-hor-center">
                    <EditableDropdown
                      :editingWidth="120"
                      v-model="disbItem.CFM_DISB_ELBW"
                      v-model:modelName="disbItem.CFM_DISB_ELBW_NAME"
                      nonSelectedText="-"
                      :disabled="disbItem.CFM_DISB_CLS === '1'"
                      dynamic="opened"
                      :options="[
                        {
                          name: '請選擇',
                          value: ''
                        },
                        {
                          name: disbItem.CFM_DISB_ELBW_NAME,
                          value: disbItem.CFM_DISB_ELBW,
                          disabled: true
                        }
                      ]"
                      :onRefreshOptions="async () => await getDisbOptions('getDisbELBWList', disbItem.CFM_DISB_PART)"
                    ></EditableDropdown>
                  </td>
                  <td class="td-hor-center is-flex">
                    <EditableDropdown
                      :editingWidth="200"
                      v-model="disbItem.CFM_DISB_LOSE"
                      v-model:modelName="disbItem.CFM_DISB_LOSE_NAME"
                      nonSelectedText="-"
                      dynamic="opened"
                      :options="[
                        {
                          name: '請選擇',
                          value: ''
                        },
                        {
                          name: disbItem.CFM_DISB_LOSE_NAME,
                          value: disbItem.CFM_DISB_LOSE,
                          disabled: true
                        }
                      ]"
                      :onRefreshOptions="
                        async () =>
                          disbItem.CFM_DISB_ELBW
                            ? await getDisbOptions('getDisbFuncListByELBW', disbItem.CFM_DISB_ELBW)
                            : await getDisbOptions('getDisbFuncListByPart', disbItem.CFM_DISB_PART)
                      "
                    ></EditableDropdown>
                    <button
                      class="button is-primary-lightest ml-2 is-editing"
                      v-if="disbGroup?.isGroupEditing"
                      @click="deleteDisbItem(disbItem.DISB_SER_NO)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </GroupEditable>
        </div>
        <div class="columns">
          <div class="column hor-right">
            <button class="button apply-btn" @click="addDisbItem">
              <span>新增給付項目</span>
              <img src="/src/assets/images/icon-add.svg" alt="ADD" />
            </button>
          </div>
        </div>
      </div>

      <!-- 重大疾病或特定傷病給付 -->
      <div class="part" v-if="highSettlementData?.HEVY_DIS_DATA">
        <h3>重大疾病或特定傷病給付</h3>

        <div class="columns has-flex-column">
          <div class="column is-half">
            <span class="field">重大疾病項目</span>
            <EditableModal
              v-model:modelText="highSettlementData.HEVY_DIS_DATA.CFM_DISEASE_NAME"
              v-model:modelValue="highSettlementData.HEVY_DIS_DATA.CFM_DISEASE_CODE"
              :modal="{
                component: HeavyDisabilityModal,
                id: 'modifyCategoryModal',
                data: {}
              }"
            ></EditableModal>
          </div>
          <div class="column is-half">
            <span class="field">重大疾病程度</span>
            <EditableDropdown
              :editingWdith="120"
              v-model="highSettlementData.HEVY_DIS_DATA.CFM_HEVY_LVL"
              :options="[
                { name: '輕度', value: '1' },
                { name: '重度', value: '2' }
              ]"            
            ></EditableDropdown>
          </div>
        </div>
        <div class="columns has-flex-column">
          <div class="column">
            <span class="field mr-12">全民健康保險重大傷病範圍</span>
            <EditableDropdown
              :editingWdith="120"
              v-model="highSettlementData.HEVY_DIS_DATA.CFM_ALL_P_HEVY"
              :options="[
                { name: '符合', value: 'Y' },
                { name: '慢性精神病', value: '1' }
              ]"            
            ></EditableDropdown>
          </div>
        </div>
      </div>

      <!-- 長期看護 -->
      <div class="part" v-if="highSettlementData?.LONG_DATA">
        <h3>長期看護</h3>

        <div class="columns has-flex-column">
          <div class="column is-half">
            <span class="field mr-12">長期看護</span>
            <EditableCheckbox v-model="highSettlementData.LONG_DATA.CFM_IS_LONG"></EditableCheckbox>
          </div>
          <div class="column is-half">
            <span class="field">長看分類</span>
            <EditableDropdown
              :editingWdith="120"
              v-model="highSettlementData.LONG_DATA.CFM_LONG_OPT"
              :options="[{ name: '認知功能障礙', value: '1' }]"
            ></EditableDropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- 豁免表示 -->
    <div class="part" v-if="highSettlementData?.WAIVER_DATA">
      <h3>豁免表示</h3>

      <div class="columns has-flex-column">
        <div class="column is-3">
          <span class="field mr-12">喪失工作能力</span>
          <EditableCheckbox v-model="highSettlementData.WAIVER_DATA.CFM_LSE_ABLY"></EditableCheckbox>
        </div>
        <div class="column is-3">
          <span class="field mr-12">連續住院</span>
          <EditableCheckbox v-model="highSettlementData.WAIVER_DATA.CFM_CONT_HSPADM"></EditableCheckbox>
        </div>
        <div class="column is-6">
          <span class="field">癌症表示</span>
          <EditableDropdown
            :editingWidth="200"
            :fitContent="true"
            v-model="highSettlementData.WAIVER_DATA.CFM_CNCR_TYPE"
            :options="[
              { name: '所有癌症', value: '1' },
              { name: '其他癌症(非低侵襲性癌症)', value: '2' }
            ]"
          ></EditableDropdown>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <span class="field mr-12">失能表示</span>
          <EditableCheckbox v-model="highSettlementData.WAIVER_DATA.CFM_DISB_IDX"></EditableCheckbox>
        </div>
      </div>
    </div>

    <div class="hidden-parts">
      <!-- 燒燙傷表示 -->
      <div class="part" v-if="highSettlementData.BURN_DATA">
        <h3>燒燙傷表示</h3>

        <div class="columns has-flex-column">
          <div class="column is-half">
            <span class="field has-tippy" data-tippy-content="資料資料">燒燙傷等級</span>
            <EditableDropdown
              :fitContent="true"
              v-model="highSettlementData.BURN_DATA.CFM_BURN_LVL"
              nonSelectedValue="0"
              :options="[
                { name: '中度', value: '1' },
                { name: '重度', value: '2' }
              ]"
            ></EditableDropdown>
            <!-- <span class="data" data-editing-type="2" data-fit-content="true" data-editing-mp="pr-4">資料資料資料</span> -->
          </div>
          <div class="column is-half">
            <span class="field has-tippy" data-tippy-content="資料資料">燒燙傷級數</span>
            <!-- BURN_LVL = 2 (重度) 才會有 => 選中度 燒燙傷級數 反灰 -->
            <EditableDropdown
              :fitContent="true"
              v-model="highSettlementData.BURN_DATA.CFM_BURN_GRAD"
              :disabled="highSettlementData.BURN_DATA.CFM_BURN_LVL === '1'"
              :watchValue="highSettlementData.BURN_DATA.CFM_BURN_LVL"
              :onRefreshOptions="getBurnLvlOptions"
              :editingWidth="180"
              :options="getBurnLvlOptions"
            ></EditableDropdown>
          </div>
        </div>
      </div>

      <!-- 定期給付保險金 -->
      <div class="part" v-if="highSettlementData.PERIOD_DATA">
        <h3>定期給付保險金</h3>

        <div class="columns has-flex-column">
          <div class="column is-half">
            <span class="field">定期給付保險金</span>
            <EditableDropdown
              :fitContent="true"
              :editingWidth="180"
              v-model="highSettlementData.PERIOD_DATA.CFM_IS_ANTY"
              :options="[
                { name: '無', value: '0' },
                { name: '分期給付', value: '1' },
                { name: '提前一次給付', value: '2' }
              ]"
            ></EditableDropdown>
          </div>
        </div>
      </div>

      <!-- 其他 -->
      <div class="columns part">
        <!-- 生命末期 -->
        <div class="column is-3" v-if="highSettlementData.LIFEEND_DATA">
          <div class="part border-none">
            <h3>生命末期</h3>
            <div class="columns has-flex-column">
              <div class="column">
                <span class="field mr-12 has-tippy" data-tippy-content="資料資料">生命末期</span>
                <EditableCheckbox v-model="highSettlementData.LIFEEND_DATA.CFM_IS_LIFE"></EditableCheckbox>
              </div>
            </div>
          </div>
        </div>

        <!-- 婦女津貼 -->
        <div class="column is-6" v-if="highSettlementData.FEMALE_DATA">
          <div class="part border-none">
            <h3>婦女津貼</h3>
            <div class="columns is-multiline has-flex-column">
              <div class="column is-3">
                <span class="field mr-12">結婚津貼</span>
                <EditableCheckbox v-model="highSettlementData.FEMALE_DATA.CFM_IS_MARY"></EditableCheckbox>
              </div>
              <div class="column is-3">
                <span class="field mr-12">生育津貼</span>
                <EditableCheckbox v-model="highSettlementData.FEMALE_DATA.CFM_IS_BABY"></EditableCheckbox>
              </div>
              <div class="column is-6">
                <span class="field mr-12">類型</span>
                <EditableDropdown
                  v-model="highSettlementData.FEMALE_DATA.FEMALE_TYPE"
                  :options="[
                    {
                      name: '分娩',
                      value: '1'
                    },
                    {
                      name: '流產',
                      value: '2'
                    }
                  ]"
                ></EditableDropdown>
              </div>
              <div class="column is-6">
                <span class="field mr-12">嬰兒數</span>
                <EditableInput
                  :inputWidth="100"
                  :schema="string().matches(/^[0-9]*$/, '格式錯誤，請輸入數字')"
                  v-model="highSettlementData.FEMALE_DATA.CFM_BABY_NUM"
                ></EditableInput>
              </div>
              <div class="column is-6">
                <span class="field mr-12">日期</span>
                <EditableDatePicker
                  v-model="highSettlementData.FEMALE_DATA.CFM_FEMALE_DATE"
                  :schema="afterOcrDateSchema"
                ></EditableDatePicker>
              </div>
            </div>
          </div>
        </div>

        <!-- 特殊 -->
        <div class="column is-3" v-if="highSettlementData.SPECIAL_DATA">
          <div class="part border-none">
            <h3>特殊</h3>
            <div class="columns is-multiline has-flex-column">
              <div class="column is-full">
                <span class="field mr-12">妊娠期併發症</span>
                <EditableModal
                  v-model:modelText="highSettlementData.SPECIAL_DATA.CFM_GRAV_NAME"
                  v-model:modelValue="highSettlementData.SPECIAL_DATA.CFM_GRAV_CODE"
                  :modal="{
                    component: GestationModal,
                    id: 'riskModal',
                    data: {}
                  }"
                ></EditableModal>
              </div>
              <div class="column is-full">
                <span class="field mr-12">臍帶血幹細胞適應症</span>
                <EditableModal
                  v-model:modelText="highSettlementData.SPECIAL_DATA.CFM_STEM_NAME"
                  v-model:modelValue="highSettlementData.SPECIAL_DATA.CFM_STEM_CODE"
                  :modal="{
                    component: CordBloodDiseaseModal,
                    id: 'riskModal',
                    data: {}
                  }"
                ></EditableModal>
              </div>
              <div class="column is-full">
                <span class="field mr-12">先天性重大殘缺</span>
                <EditableModal
                  v-model:modelText="highSettlementData.SPECIAL_DATA.CFM_CON_NAME"
                  v-model:modelValue="highSettlementData.SPECIAL_DATA.CFM_CON_CODE"
                  :modal="{
                    component: CongenitalDisabilityModal,
                    id: 'riskModal',
                    data: {}
                  }"
                ></EditableModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 大額給付項目新增 Button Group-->
    <div class="part">
      <div class="columns">
        <div class="column highsettlement-column">
          <button
            v-if="!highSettlementData.DEATH_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('DEATH_DATA')"
          >
            <cathay-translate code="Component_HighSettlementArea_003"/>
          </button>
          <button
            v-if="!highSettlementData.FULLDISB_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('FULLDISB_DATA')"
          >
             <cathay-translate code="Component_HighSettlementArea_004"/>
          </button>
          <button
            v-if="!highSettlementData.DISB_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('DISB_DATA')"
          >
             <cathay-translate code="Component_HighSettlementArea_005"/>
          </button>
          <button
            v-if="!highSettlementData.HEVY_DIS_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('HEVY_DIS_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_006"/>
          </button>
          <button
            v-if="!highSettlementData.LONG_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('LONG_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_007"/>
          </button>
          <button
            v-if="!highSettlementData.WAIVER_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('WAIVER_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_008"/>
          </button>
          <button
            v-if="!highSettlementData.BURN_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('BURN_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_009"/>
          </button>
          <button
            v-if="!highSettlementData.PERIOD_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('PERIOD_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_010"/>
          </button>
          <button
            v-if="!highSettlementData.LIFEEND_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('LIFEEND_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_011"/>
          </button>
          <button
            v-if="!highSettlementData.FEMALE_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('FEMALE_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_012"/>
          </button>
          <button
            v-if="!highSettlementData.SPECIAL_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('SPECIAL_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_013"/>
          </button>
          <button
            v-if="!isShowInKindPayArea"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addInKindPayArea()"
          >
          <cathay-translate code="Component_HighSettlementArea_014"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import EditableDatePicker from '~/components/Editable/EditableDatePicker.vue';
  import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
  import EditableInput from '~/components/Editable/EditableInput.vue';
  import GroupEditable from '~/components/Editable/GroupEditable.vue';
  import EditableCheckbox from '~/components/Editable/EditableCheckbox.vue';
  import EditableModal from '~/components/Editable/EditableModal.vue';
  import HospitalModal from './Modals/HospitalModal.vue';
  import ICDModal from './Modals/ICDModal.vue';
  import FullDisabilityModal from './Modals/FullDisabilityModal.vue';
  import HeavyDisabilityModal from './Modals/HeavyDisabilityModal.vue';
  import GestationModal from './Modals/GestationModal.vue';
  import CordBloodDiseaseModal from './Modals/CordBloodDiseaseModal.vue';
  import CongenitalDisabilityModal from './Modals/CongenitalDisabilityModal.vue';
  import { useApplyStore } from '~/stores/apply';
  import { sequence } from '../../../../common/utils';
  import { remove, isEmpty } from 'lodash-es';
  import { string } from 'yup';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { storeToRefs } from 'pinia';

  const { $swal } = useSwal();
  const { isSameOrAfter } = useMoment();
  const applyStore = useApplyStore();
  const { isShowInKindPayArea } = storeToRefs(applyStore);
  const props = defineProps({
    highSettlementData: {
      type: Object,
      required: true,
      default: {}
    }
  });
  const highSettlementAreaTarget = ref(null);

  const highSettlementData = toRef(props, 'highSettlementData');

  // 取得死亡縣市
  const getDieCityOptions = async () => {
    // debugger;
    let places = await applyStore.getDiePlaceArea();
    return [...new Set(places.map((e) => e.CITY_NAME))].map((m) => ({
      name: m,
      value: m
    }));
  };

  // 取得死亡區域
  const getDieAreaOptions = async (city) => {
    // 首次進來時city不會有值傳入
    if (city === undefined) {
      city = highSettlementData.value.DEATH_DATA.CFM_DEAD_ADDR1;
    }

    let places = await applyStore.getDiePlaceArea();
    let areas = places
      .filter((e) => e.CITY_NAME === city)
      .map((m) => ({
        name: m.LOCAL_ZONE_NAME,
        value: m.LOCAL_ZONE_NAME
      }));
    return areas;
  };

  const disbGroup = ref(null);

  const showingDisbData = computed(() => highSettlementData.value.DISB_DATA.DISB_ITEM_DATA.filter((e) => e.ACT_CD !== 'D'));

  // 新增失能給付
  const addDisbItem = () => {
    const serNo = sequence(highSettlementData.value.DISB_DATA.DISB_ITEM_DATA, 'DISB_SER_NO');
    highSettlementData.value.DISB_DATA.DISB_ITEM_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo7',
      DISB_SER_NO: serNo.toString(),
      CFM_DISB_NO: '',
      CFM_DISB_CLS: '',
      CFM_DISB_PART: '',
      CFM_DISB_LF: '',
      CFM_DISB_ELBW: '',
      CFM_DISB_LOSE: '',
      MAN_ISRT_IND: 'Y',
      ACT_CD: 'A',
      CFM_DISB_PART_NAME: '',
      CFM_DISB_ELBW_NAME: '',
      CFM_DISB_CLS_NAME: '',
      CFM_DISB_LOSE_NAME: '',
      CFM_DISB_LF_NAME: '',
      CFM_DISB_NO_NAME: ''
    });
    disbGroup.value?.refreshGroup();
  };

  // 刪除失能給付
  const deleteDisbItem = (serNo) => {
    let item = highSettlementData.value.DISB_DATA.DISB_ITEM_DATA.find((e) => e.DISB_SER_NO === serNo);
    if (item) item.ACT_CD = 'D';
    // remove(highSettlementData.value.DISB_DATA.DISB_ITEM_DATA, (e) => e.DISB_SER_NO === serNo);
  };

  const afterOcrDateSchema = string()
    .nullable()
    .test(
      'after-ocrDate',
      '該日期不可早於事故日',
      (value) => isEmpty(value) || isEmpty(applyStore.claimData.OCR_DATE) || isSameOrAfter(value, applyStore.claimData.OCR_DATE)
    );

  const deathDateRequiredSchema = string()
    .test(
      'death-date-has-value',
      '不能為空白',
      (value) => !(isEmpty(value) && highSettlementData.value.DEATH_DATA?.CFM_DEAD_DATE && hasClamCats(['A']))
    )
    .test('death-required', '索賠類別勾選身故(A)時，不能為空白', (value) => !(hasClamCats(['A']) && !value));

  const deathRequiredSchema = string().test(
    'death-required',
    '索賠類別勾選身故(A)時，不能為空白',
    (value) => !(hasClamCats(['A']) && !value)
  );

  // 各區塊的新增
  const addArea = (areaName) => {
    let template = {};
    switch (areaName) {
      case 'BURN_DATA':
        template = {
          CFM_BURN_LVL: '0',
          CFM_BURN_GRAD: ''
        };
        break;
      case 'PERIOD_DATA':
        template = { CFM_IS_ANTY: '0' };
        break;
      case 'LIFEEND_DATA':
        template = { CFM_IS_LIFE: 'N' };
        break;
      case 'FEMALE_DATA':
        template = {
          CFM_IS_MARY: 'N',
          CFM_IS_BABY: 'N',
          CFM_BITH_DATE: '',
          CFM_BABY_NUM: '',
          FEMALE_TYPE: '1',
          CFM_FEMALE_DATE: '',
          CFM_ABORT_DATE: ''
        };
        break;
      case 'SPECIAL_DATA':
        template = {
          CFM_GRAV_CODE: '',
          CFM_GRAV_NAME: '',
          CFM_STEM_CODE: '',
          CFM_STEM_NAME: '',
          CFM_CON_CODE: '',
          CFM_CON_NAME: ''
        };
        break;
      case 'DEATH_DATA':
        template = {
          CFM_DEAD_DATE: '',
          CFM_DEAD_TYPE: '',
          CFM_ICD_CODE: '',
          CFM_ICD_NAME: '',
          CFM_HOSP_CODE: '',
          CFM_HOSP_NAME: '',
          CFM_PRO_NAME: '',
          CFM_DOC_NAME: '',
          CFM_PROV_NO: '',
          CFM_PROV_DATE: '',
          CFM_DEAD_RESN1A: '',
          CFM_DEAD_RESN1B: '',
          CFM_DEAD_RESN1C: '',
          CFM_DEAD_RESN1D: '',
          CFM_DEAD_RESN2: '',
          CFM_DEAD_ADDR1: '',
          CFM_DEAD_ADDR2: '',
          CFM_DEAD_ADDR3: '',
          CFM_FULL_CNCR: '',
          CFM_EMP_ACC: ''
        };
        break;
      case 'DISB_DATA':
        template = {
          CFM_DISB_EQP: 'N',
          javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo16',
          DISB_ITEM_DATA: []
        };
        break;
      case 'FULLDISB_DATA':
        template = {
          CFM_FULL_CON: '',
          CFM_DISB_CAT: '',
          CFM_DISB_CAT_NAME: ''
        };
        break;
      case 'HEVY_DIS_DATA':
        template = {
          CFM_DISEASE_CODE: '',
          CFM_DISEASE_NAME: '',
          CFM_HEVY_LVL: '',
          CFM_ALL_P_HEVY: ''
        };
        break;
      case 'LONG_DATA':
        template = {
          CFM_IS_LONG: '',
          CFM_LONG_OPT: ''
        };
        break;
      case 'WAIVER_DATA':
        template = {
          CFM_LSE_ABLY: '',
          CFM_DISB_IDX: '',
          CFM_CONT_HSPADM: '',
          CFM_CNCR_TYPE: ''
        };
      default:
        break;
    }
    highSettlementData.value[areaName] = template;

    // 0825 點擊後要將大額給付區塊展開
    if (highSettlementAreaTarget.value && template) {
      if (!highSettlementAreaTarget.value.classList.contains('is-expanded')) {
        highSettlementAreaTarget.value.classList.add('is-expanded');
        highSettlementAreaTarget.value.querySelector('.card-toggle-btn').classList.add('expand');
      }
    }
  };

  // 新增實物給付
  const addInKindPayArea = () => {
    isShowInKindPayArea.value = true;
  }; 

  const hasAddButtonsArea = computed(
    () =>
      !(
        highSettlementData.value.BURN_DATA &&
        highSettlementData.value.PERIOD_DATA &&
        highSettlementData.value.LIFEEND_DATA &&
        highSettlementData.value.FEMALE_DATA &&
        highSettlementData.value.SPECIAL_DATA
      )
  );

  // 失能項目下拉選單
  const getDisbOptions = async (action, requestValue) => {
    try {
      let options = [{ name: '請選擇', value: '', selected: true }];
      if (action !== 'getDisbClsList' && !requestValue) {
        return options;
        // throw 'EMPTY VALUE';
      }
      let list = await applyStore.getDisbList(action, requestValue);
      // debugger;
      list.forEach((e) => {
        options.push({
          name: e.NAME,
          value: e.KEY
        });
      });
      return options;
    } catch (e) {
      console.error(e);
      $swal.fail(e);
      return [{ name: '請選擇', value: '' }];
    }
  };

  // 索賠類別必填檢核
  const hasClamCats = (clamCats) => {
    let result = false;
    for (const c of clamCats) {
      if (applyStore.claimData?.CFM_CLAM_CAT.includes(c)) {
        result = true;
        break;
      }
    }
    return result;
  };

  const getBurnLvlOptions = async () => {
    return highSettlementData.value.BURN_DATA.CFM_BURN_LVL === '1'
      ? []
      : [
          { name: '重度燒燙傷 1 級', value: '1' },
          { name: '重度燒燙傷 2 級', value: '2' },
          { name: '重度燒燙傷 3 級', value: '3' },
          { name: '重度燒燙傷 4 級', value: '4' },
          { name: '重度燒燙傷 5 級', value: '5' }
        ]
  };
</script>
<style lang="scss" scoped>
  .highsettlement-column {
    display: flex !important;
    flex-wrap: wrap;
    gap: 12px;
    button {
      margin: 0 !important;
    }
  }
</style>
