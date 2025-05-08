<template>
  <div class="card is-full third-card is-expanded" id="ApplyThirdCard" ref="diagArea">
    <button class="card-toggle-btn expand"></button>
    <h2>診斷書</h2>
    <Tabs @onTabClick="onTabChanged" ref="diagTabs" class="folder-style">
      <Tab
        v-for="(diag, diagIndex) in showingDiags"
        :key="diag.DIAG_SER_NO"
        :hasSvg="diag.MAN_ISRT_IND === 'Y'"
        :isActive="diag.DIAG_SER_NO == '1'"
        :title="`診斷書${diagIndex + 1}`"
      >
        <section>
          <!-- 診斷書1 -->
          <!-- 基本資料 -->
          <div class="part border-none">
            <h3>基本資料</h3>
            <div class="columns has-flex-column">
              <div class="column is-3">
                <span class="field">醫生科別</span>
                <EditableModal
                  v-model:modelText="diag.CFM_MAIN_DEPNM"
                  v-model:modelText2="diag.CFM_SUB_DEPNM"
                  v-model:modelValue="diag.CFM_MAIN_DEPCD"
                  v-model:modelValue2="diag.CFM_SUB_DEPCD"
                  :modal="{
                    component: DoctorBranchModal,
                    id: 'manualApprovedEditReason',
                    data: {}
                  }"
                  :schema="string().nullable().required('請選擇科別')"
                ></EditableModal>
              </div>
              <div class="column is-3">
                <span class="field">醫師姓名</span>
                <EditableInput v-model="diag.DOC_NAME" :schema="string().required('請輸入姓名')"></EditableInput>
              </div>
              <div class="column is-4">
                <span class="field">醫院中文</span>
                <EditableModal
                  v-model:modelText="diag.HOSP_NAME"
                  v-model:modelValue="diag.HOSP_CODE"
                  :modal="{
                    component: HospitalModal,
                    id: 'selectHospitalModal',
                    data: {}
                  }"
                  :schema="string().required('請選擇醫院')"
                ></EditableModal>
              </div>
              <div class="column is-2 hor-right p-0">
                <button :disabled="!diag.HOSP_CODE" @click="onClickDiagVideo(diag.HOSP_CODE)" class="button apply-btn">
                  正版診斷書影像
                </button>
              </div>
            </div>
          </div>

          <!-- 診斷資料 -->
          <div class="part">
            <h3>診斷資料</h3>
            <div class="columns has-flex-column">
              <div class="column">
                <span class="field">診斷內容</span>
                <EditableInput
                  :inputWidth="800"
                  v-model="diag.DIAG_CTX"
                  :schema="string().required('請輸入診斷內容')"
                ></EditableInput>
              </div>
            </div>
            <div class="columns has-flex-column">
              <GroupEditable ref="icdGroups">
                <span class="field">診斷病名</span>
                <div class="columns">
                  <div class="column">
                    <EditableModal
                      v-model:modelText="diag.CFM_ICD_NAME1"
                      v-model:modelValue="diag.CFM_ICD_CODE1"
                      :editingWidth="143"
                      placeholder="請選擇ICD"
                      :modal="{
                        component: ICDModal,
                        id: 'diseaseCode',
                        data: {}
                      }"
                      :schema="string().nullable().required('請選擇ICD')"
                    ></EditableModal>
                    <button
                      class="button is-primary-lightest is-editing"
                      style="min-width: 40px"
                      v-if="icdGroups[currentTabIndex]?.isGroupEditing"
                      @click="clearICD(1)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </div>
                  <div class="column ml-3">
                    <EditableModal
                      v-model:modelText="diag.CFM_ICD_NAME2"
                      v-model:modelValue="diag.CFM_ICD_CODE2"
                      :editingWidth="143"
                      placeholder="請選擇ICD"
                      :placeholderOnlyTrigger="true"
                      :modal="{
                        component: ICDModal,
                        id: 'diseaseCode',
                        data: {}
                      }"
                    ></EditableModal>
                    <button
                      class="button is-primary-lightest is-editing"
                      style="min-width: 40px"
                      v-if="icdGroups[currentTabIndex]?.isGroupEditing"
                      @click="clearICD(2)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </div>
                  <div class="column ml-3">
                    <EditableModal
                      v-model:modelText="diag.CFM_ICD_NAME3"
                      v-model:modelValue="diag.CFM_ICD_CODE3"
                      :editingWidth="143"
                      placeholder="請選擇ICD"
                      :placeholderOnlyTrigger="true"
                      :modal="{
                        component: ICDModal,
                        id: 'diseaseCode',
                        data: {}
                      }"
                    ></EditableModal>
                    <button
                      class="button is-primary-lightest is-editing"
                      style="min-width: 40px"
                      v-if="icdGroups[currentTabIndex]?.isGroupEditing"
                      @click="clearICD(3)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </div>
                  <div class="column ml-3">
                    <EditableModal
                      v-model:modelText="diag.CFM_ICD_NAME4"
                      v-model:modelValue="diag.CFM_ICD_CODE4"
                      :editingWidth="143"
                      placeholder="請選擇ICD"
                      :placeholderOnlyTrigger="true"
                      :modal="{
                        component: ICDModal,
                        id: 'diseaseCode',
                        data: {}
                      }"
                    ></EditableModal>
                    <button
                      class="button is-primary-lightest is-editing"
                      style="min-width: 40px"
                      v-if="icdGroups[currentTabIndex]?.isGroupEditing"
                      @click="clearICD(4)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </div>
                  <div class="column ml-3">
                    <EditableModal
                      v-model:modelText="diag.CFM_ICD_NAME5"
                      v-model:modelValue="diag.CFM_ICD_CODE5"
                      :editingWidth="143"
                      placeholder="請選擇ICD"
                      :placeholderOnlyTrigger="true"
                      :modal="{
                        component: ICDModal,
                        id: 'diseaseCode',
                        data: {}
                      }"
                    ></EditableModal>
                    <button
                      class="button is-primary-lightest is-editing"
                      style="min-width: 40px"
                      v-if="icdGroups[currentTabIndex]?.isGroupEditing"
                      @click="clearICD(5)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </div>
                </div>
              </GroupEditable>
            </div>
            <!-- 癌症資料 -->
            <div class="columns has-flex-column" v-if="diag.CANCER_DATA">
              <div class="column is-3">
                <span class="field has-tippy" data-tippy-content="資料資料">癌症分類</span>
                <EditableModal
                  v-model:modelText="diag.CANCER_DATA[0].CFM_CANCER_NAME"
                  v-model:modelValue="diag.CANCER_DATA[0].CFM_CANCER_NO"
                  :modal="{
                    component: CancerCategoryModal,
                    id: 'riskModal',
                    data: {}
                  }"
                ></EditableModal>
              </div>
              <div class="column is-3">
                <span class="field">癌症期別</span>
                <EditableDropdown
                  v-model="diag.CANCER_DATA[0].CFM_CANCER_STG"
                  :options="[
                    { name: '原位癌', value: 'Z' },
                    { name: '第0期', value: '0' },
                    { name: '第1期', value: '1' },
                    { name: '第2期', value: '2' },
                    { name: '第3期', value: '3' },
                    { name: '第4期', value: '4' },
                    { name: '復發', value: 'R' },
                    { name: '轉移', value: 'T' }
                  ]"
                ></EditableDropdown>
              </div>
              <div class="column is-6">
                <span class="field">罹癌日期</span>
                <EditableDatePicker v-model="diag.CANCER_DATA[0].CFM_CANCER_DATE"></EditableDatePicker>
              </div>
            </div>
            <div class="columns has-flex-column" v-if="diag.CANCER_DATA && !isEmpty(diag.CANCER_DATA[0].CFM_CANCER_DATE)">
              <div class="column is-3"></div>
              <div class="column is-3"></div>
              <div class="column is-6 has-text-danger">
                若商品同時符合罹癌豁免保費條件，需於大額給付畫面<br>-輸入「符合發生日」並點選「豁免表示+癌症表示」。
              </div>
            </div>
            <!-- //TODO: 尚未確認 -->
            <div class="columns" v-if="!diag.CANCER_DATA">
              <div class="column pt-1">
                <button class="button apply-btn" @click="addCancerData(diag)">
                  <span>新增癌症資料</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>

          <!-- 骨折換算資料 -->
          <div class="part" v-if="!hasBoneData || (diag.BONE_CODE_DATA?.length > 0 && diag.BONE_CODE_DATA[0]?.CFM_BONE_CODE)">
            <h3>骨折換算資料</h3>
            <div class="columns has-flex-column" v-if="diag.BONE_CODE_DATA && diag.BONE_CODE_DATA.length > 0">
              <div class="column is-half">
                <span class="field has-tippy" data-tippy-content="資料資料">骨折換算</span>
                <EditableModal
                  v-model:modelText="diag.BONE_CODE_DATA[0].CFM_BONE_NAME"
                  v-model:modelValue="diag.BONE_CODE_DATA[0].CFM_BONE_CODE"
                  :modal="{
                    component: BoneFractureModal,
                    id: 'disabilityQuery',
                    data: {}
                  }"
                ></EditableModal>
              </div>
            </div>
            <div class="columns" v-if="!diag.BONE_CODE_DATA">
              <div class="column pt-1">
                <button class="button apply-btn" @click="addBoneCodeData(diag)">
                  <span>新增骨折換算</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>

          <!-- 就醫資料 -->
          <div class="part">
            <h3>就醫資料</h3>
          </div>
          <!-- 住院起訖 -->
          <div v-show="diag.MEDICAL_DATA.STAY_HOSP_INTERVAL">
            <!-- 上方表頭 -->
            <div class="columns">
              <div class="column is-1 p-0"></div>
              <div class="column is-11 p-0">
                <div class="columns">
                  <div class="column is-half border-right padding-only-right">
                    <div class="columns">
                      <div class="column is-1 hor-center p-0">
                        <span class="field mr-none">序號</span>
                      </div>
                      <div class="column is-5 p-0">
                        <span class="field">日期區間</span>
                      </div>
                      <div class="column is-6 p-0" style="margin-left: 15px">
                        <span class="field">連結收據</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-half padding-only-left">
                    <div class="columns">
                      <div class="column is-1 hor-center p-0">
                        <span class="field mr-none">序號</span>
                      </div>
                      <div class="column is-5 p-0">
                        <span class="field">日期區間</span>
                      </div>
                      <div class="column is-6 p-0" style="margin-left: 15px">
                        <span class="field">連結收據</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 下方表格 -->
            <div class="columns is-vcentered">
              <!--欄位名稱 -->
              <div class="column is-1">
                <span class="field mr-1">住院起訖</span>
                <EllipseTippy
                  :content="diag.MEDICAL_DATA.STAY_HOSP_NOTICE"
                  v-if="diag.MEDICAL_DATA.STAY_HOSP_NOTICE"
                  disableEllipse
                >
                  <img src="/src/assets/images/icon-clock.svg" alt="CLOCK" />
                </EllipseTippy>
              </div>

              <!--表格內容 -->
              <GroupEditable class="is-11 p-0" ref="stayHospitalGroups">
                <div class="columns is-multiline">
                  <!-- 第1筆資料 -->
                  <div
                    :class="[
                      'column',
                      'is-half',
                      {
                        'border-right': index % 2 === 0,
                        'padding-only-right': index % 2 === 0,
                        'padding-only-left': index % 2 !== 0
                      }
                    ]"
                    v-for="(stayData, index) in diag.MEDICAL_DATA.STAY_HOSP_INTERVAL"
                    :key="stayData.SER_NO"
                  >
                    <div class="columns border-bot has-flex-column">
                      <div class="column is-1 hor-center">
                        <span class="data not-editable">{{ index + 1 }}</span>
                      </div>
                      <div class="column is-5">
                        <EditableDateRangePicker
                          v-model:modelStartDate="stayData.CFM_STR_DATE"
                          v-model:modelEndDate="stayData.CFM_END_DATE"
                          :schema="afterOcrDateSchema"
                          :hasRepeatRange="() => detectRepeatRangeDate(diag.MEDICAL_DATA.STAY_HOSP_INTERVAL, stayData)"
                        ></EditableDateRangePicker>
                      </div>
                      <div class="column is-6 is-flex is-align-item-center" style="margin-left: 15px">
                        <EditableMutipleDropdown
                          :options="getReceiptLinkOptions(stayData.RECEIPT_SER_NOS)"
                          v-model="stayData.RECEIPT_SER_NOS"
                        ></EditableMutipleDropdown>
                        <button
                          class="button is-primary-lightest ml-2 is-editing"
                          v-if="stayHospitalGroups[currentTabIndex]?.isGroupEditing && !isApplyDate(stayData)"
                          @click="deleteStayHospital(stayData.SER_NO)"
                        >
                          <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GroupEditable>
            </div>

            <div class="columns">
              <div class="column hor-right">
                <button class="button apply-btn" @click="addStayHospital">
                  <span>新增</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>

          <!-- 日間病房 -->
          <div class="part" v-show="diag.MEDICAL_DATA.DAY_HOSP_INTERVAL">
            <div class="columns">
              <div class="column">
                <span class="field">日間病房</span>
                <!--// 有日間病房資料就勾有-->
                <span class="data">
                  <img
                    v-if="diag.MEDICAL_DATA?.DAY_HOSP_INTERVAL?.length > 0"
                    src="/src/assets/images/icon-checkmark-check.svg"
                    alt="CHECKMARK"
                  />
                  <template v-else>無</template>
                </span>
              </div>
            </div>

            <!-- 上方表頭 -->
            <div class="columns">
              <div class="column is-1 p-0"></div>
              <div class="column is-11 p-0">
                <div class="columns">
                  <div class="column is-half border-right padding-only-right">
                    <div class="columns">
                      <div class="column is-1 hor-center p-0">
                        <span class="field mr-none">序號</span>
                      </div>
                      <div class="column is-5 p-0">
                        <span class="field">日期區間</span>
                      </div>
                      <div class="column is-6 p-0" style="margin-left: 15px">
                        <span class="field">總日數</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-half padding-only-left">
                    <div class="columns">
                      <div class="column is-1 hor-center p-0">
                        <span class="field mr-none">序號</span>
                      </div>
                      <div class="column is-5 p-0">
                        <span class="field">日期區間</span>
                      </div>
                      <div class="column is-6 p-0" style="margin-left: 15px">
                        <span class="field">總日數</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 下方表格 -->
            <div class="columns is-vcentered">
              <!--欄位名稱 -->
              <div class="column is-1">
                <span class="field">日間病房</span>
              </div>

              <!--表格內容 -->
              <GroupEditable class="is-11 p-0" ref="dayWardGroups">
                <div class="columns is-multiline">
                  <!-- 第1筆資料 -->
                  <div
                    :class="[
                      'column',
                      'is-half',
                      {
                        'border-right': index % 2 === 0,
                        'padding-only-right': index % 2 === 0,
                        'padding-only-left': index % 2 !== 0
                      }
                    ]"
                    v-for="(dayHospital, index) in diag.MEDICAL_DATA.DAY_HOSP_INTERVAL"
                    :key="dayHospital.SER_NO"
                  >
                    <div class="columns border-bot has-flex-column">
                      <div class="column is-1 hor-center">
                        <span class="data not-editable">{{ index + 1 }}</span>
                      </div>
                      <div class="column is-5">
                        <EditableDateRangePicker
                          v-model:modelStartDate="dayHospital.CFM_STR_DATE"
                          v-model:modelEndDate="dayHospital.CFM_END_DATE"
                          :schema="
                            afterOcrDateSchema.test(
                              'required',
                              '需輸入日期區間',
                              (value) => !(dayHospital.DAYS_SUM && (!dayHospital.CFM_STR_DATE || !dayHospital.CFM_END_DATE))
                            )
                          "
                          :hasRepeatRange="() => detectRepeatRangeDate(diag.MEDICAL_DATA.DAY_HOSP_INTERVAL, dayHospital)"
                        ></EditableDateRangePicker>
                      </div>
                      <div class="column is-6 p-0">
                        <div class="columns is-vcentered">
                          <div class="column mr-1" style="margin-left: 15px">
                            <EditableInput
                              v-model="dayHospital.DAYS_SUM"
                              :inputWidth="100"
                              :schema="
                                string()
                                  .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                                  .max(6, '最多6位數')
                              "
                            ></EditableInput>
                          </div>
                          <div class="column"><span class="data">天</span></div>
                          <button
                            class="button is-primary-lightest ml-2 is-editing"
                            v-if="dayWardGroups[currentTabIndex]?.isGroupEditing && !isApplyDate(dayHospital)"
                            @click="deleteDayWard(dayHospital.SER_NO)"
                          >
                            <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GroupEditable>
            </div>

            <div class="columns">
              <div class="column hor-right">
                <button class="button apply-btn" @click="addDayWard">
                  <span>新增</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>

          <!-- 燒燙傷病房 -->
          <div class="part" v-if="diag.MEDICAL_DATA.BURN_HOSP_INTERVAL">
            <div class="columns is-align-items-center">
              <div class="column is-narrow fixed-width-143">
                <span class="field">燒燙傷病房起訖</span>
              </div>
              <GroupEditable class="p-0" :data="diag.MEDICAL_DATA.BURN_HOSP_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                <div class="columns is-multiline has-flex-column">
                  <div
                    :class="[
                      'column',
                      { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                      ,
                      'p-0',
                      'has-margin',
                      { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                    ]"
                    v-for="(burnData, index) in diag.MEDICAL_DATA.BURN_HOSP_INTERVAL"
                    :key="index"
                  >
                    <EditableDateRangePicker
                      v-model:modelStartDate="burnData.CFM_STR_DATE"
                      v-model:modelEndDate="burnData.CFM_END_DATE"
                      :schema="afterOcrDateSchema"
                      :hasRepeatRange="() => detectRepeatRangeDate(diag.MEDICAL_DATA.BURN_HOSP_INTERVAL, burnData)"
                      :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                      :onClickDelete="
                        isApplyDate(burnData)
                          ? null
                          : () => {
                              onClickDeleteDateRange(diag.MEDICAL_DATA.BURN_HOSP_INTERVAL, burnData);
                            }
                      "
                    ></EditableDateRangePicker>
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>

          <!-- 加護病房起訖 -->
          <div class="part" v-if="diag.MEDICAL_DATA.ICU_INTERVAL">
            <div class="columns is-vcentered">
              <div class="column is-narrow fixed-width-143">
                <span class="field">加護病房起訖</span>
              </div>
              <GroupEditable class="p-0" :data="diag.MEDICAL_DATA.ICU_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                <div class="columns is-multiline has-flex-column">
                  <div
                    :class="[
                      'column',
                      { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                      'p-0',
                      'has-margin',
                      { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                    ]"
                    v-for="(icuData, index) in diag.MEDICAL_DATA.ICU_INTERVAL"
                    :key="index"
                  >
                    <EditableDateRangePicker
                      v-model:modelStartDate="icuData.CFM_STR_DATE"
                      v-model:modelEndDate="icuData.CFM_END_DATE"
                      :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                      :schema="afterOcrDateSchema"
                      :hasRepeatRange="() => detectRepeatRangeDate(diag.MEDICAL_DATA.ICU_INTERVAL, icuData)"
                      :onClickDelete="
                        isApplyDate(icuData)
                          ? null
                          : () => {
                              onClickDeleteDateRange(diag.MEDICAL_DATA.ICU_INTERVAL, icuData);
                            }
                      "
                    ></EditableDateRangePicker>
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>

          <!-- 在家療養 -->
          <div class="part" v-if="diag.MEDICAL_DATA.HOME_INTERVAL">
            <div class="columns is-align-items-center">
              <div class="column is-narrow fixed-width-143">
                <span class="field">在家療養</span>
              </div>
              <GroupEditable class="p-0" :data="diag.MEDICAL_DATA.HOME_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                <div class="columns is-multiline has-flex-column">
                  <div
                    :class="[
                      'column',
                      { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                      'p-0',
                      'has-margin',
                      { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                    ]"
                    v-for="(homeData, index) in diag.MEDICAL_DATA.HOME_INTERVAL"
                    :key="index"
                  >
                    <EditableDateRangePicker
                      v-model:modelStartDate="homeData.CFM_STR_DATE"
                      v-model:modelEndDate="homeData.CFM_END_DATE"
                      :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                      :schema="afterOcrDateSchema"
                      :hasRepeatRange="() => detectRepeatRangeDate(diag.MEDICAL_DATA.HOME_INTERVAL, homeData)"
                      :onClickDelete="
                        isApplyDate(homeData)
                          ? null
                          : () => {
                              onClickDeleteDateRange(diag.MEDICAL_DATA.HOME_INTERVAL, homeData);
                            }
                      "
                    ></EditableDateRangePicker>
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>

          <!-- 門診日期 -->
          <div class="part" v-if="diag.MEDICAL_DATA.CLINIC_DATA">
            <div class="columns is-vcentered">
              <div class="column is-narrow fixed-width-143">
                <span class="field mr-1">門診日期</span>
                <EllipseTippy
                  :content="diag.MEDICAL_DATA.CLINIC_DATA_NOTICE"
                  v-if="diag.MEDICAL_DATA.CLINIC_DATA_NOTICE"
                  disableEllipse
                >
                  <img src="/src/assets/images/icon-clock.svg" alt="CLOCK" />
                </EllipseTippy>

              </div>
              <GroupEditable
                class="p-0"
                :data="diag.MEDICAL_DATA.CLINIC_DATA"
                :multipleDate="diag.MEDICAL_DATA.CLINIC_DATA?.map((e) => e.CFM_STR_DATE)"
                :onClickInsert="onClickInsertMultiDate"
              >
                <div class="columns is-multiline">
                  <div
                    :class="[
                      'column',
                      'is-4',
                      'p-0',
                      'has-margin',
                      'hor-center',
                      {'border-right': (index + 1) % 3 !== 0 }
                    ]"
                    v-for="(clinic, index) in diag.MEDICAL_DATA.CLINIC_DATA"
                    :key="clinic"
                  >
                    <EditableDatePicker
                      v-model="clinic.CFM_STR_DATE"
                      :schema="
                        afterOcrDateSchema.test('repeatDate', '已有相同日期', () => {
                          return repeatDateSchema(diag.MEDICAL_DATA.CLINIC_DATA, clinic);
                        })
                      "
                      :onClickDelete="() => onClickDeleteDate(diag.MEDICAL_DATA.CLINIC_DATA, clinic)"
                    >
                      
                    </EditableDatePicker>
										<label class="is-editing mx-2 is-flex is-align-items-center">
                      <EditableCheckbox v-model="clinic.CFM_BURN_CODE"></EditableCheckbox><span class="ml-1">燒燙傷</span>
                    </label>																						   
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>

          <!-- 放射日期 -->
          <div class="part" v-if="diag.MEDICAL_DATA.RAD_DATA">
            <div class="columns has-padding is-align-items-center">
              <div class="column is-narrow fixed-width-143 p-0">
                <span class="field">放射日期</span>
              </div>
              <GroupEditable
                class="p-0"
                :data="diag.MEDICAL_DATA.RAD_DATA"
                :multipleDate="diag.MEDICAL_DATA.RAD_DATA?.map((e) => e.CFM_STR_DATE)"
                :onClickInsert="onClickInsertMultiDate"
              >
                <div class="columns is-multiline">
                  <div
                    :class="[
                      'column',
                      { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                      'p-0',
                      'has-margin',
                      { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                    ]"
                    v-for="(rad, index) in diag.MEDICAL_DATA.RAD_DATA"
                    :key="rad"
                  >
                    <EditableDatePicker
                      v-model="rad.CFM_STR_DATE"
                      :schema="
                        afterOcrDateSchema.test('repeatDate', '已有相同日期', () => {
                          return repeatDateSchema(diag.MEDICAL_DATA.RAD_DATA, rad);
                        })
                      "
                      :onClickDelete="isApplyDate(rad) ? () => onClickDeleteDate(diag.MEDICAL_DATA.RAD_DATA, rad) : () => onClickDeleteDate(diag.MEDICAL_DATA.RAD_DATA, rad)"
                    ></EditableDatePicker>
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>

          <!-- 化療日期 -->
          <div class="part" v-if="diag.MEDICAL_DATA.CHEM_DATA">
            <div class="columns has-padding is-align-items-center">
              <div class="column is-narrow fixed-width-143 p-0">
                <span class="field">化療日期</span>
              </div>
              <GroupEditable
                class="p-0"
                :data="diag.MEDICAL_DATA.CHEM_DATA"
                :multipleDate="diag.MEDICAL_DATA.CHEM_DATA?.map((e) => e.CFM_STR_DATE)"
                :onClickInsert="onClickInsertMultiDate"
              >
                <div class="columns is-multiline">
                  <div
                    :class="[
                      'column',
                      { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                      'p-0',
                      'has-margin',
                      { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                    ]"
                    v-for="(chem, index) in diag.MEDICAL_DATA.CHEM_DATA"
                    :key="chem"
                  >
                    <EditableDatePicker
                      v-model="chem.CFM_STR_DATE"
                      :schema="
                        afterOcrDateSchema.test('repeatDate', '已有相同日期', () => {
                          return repeatDateSchema(diag.MEDICAL_DATA.CHEM_DATA, chem);
                        })
                      "
                      :onClickDelete="isApplyDate(chem) ? () => onClickDeleteDate(diag.MEDICAL_DATA.CHEM_DATA, chem) : () => onClickDeleteDate(diag.MEDICAL_DATA.CHEM_DATA, chem)"
                    ></EditableDatePicker>
                  </div>
                </div>
              </GroupEditable>
            </div>
          </div>

          <!-- 手術日期 -->
          <div class="part" v-show="diag.MEDICAL_DATA.OPER_DATA">
            <!-- 上方表頭 -->
            <div class="columns mr-top">
              <div class="column is-1 p-0"></div>
              <div class="column is-11 p-0">
                <div class="columns">
                  <div class="column is-1 hor-center">
                    <span class="field mr-none">序號</span>
                  </div>
                  <div class="column is-narrow">
                    <div class="w-fixed-160">
                      <span class="field">日期</span>
                    </div>
                  </div>
                  <div class="column is-4">
                    <span class="field">手術代碼/名稱</span>
                  </div>
                  <div class="column is-1">
                    <span class="field">癌症手術</span>
                  </div>
                  <div class="column">
                    <span class="field">險別</span>
                  </div>
                  <div class="column" style="min-width: 155px">
                    <span class="field">倍數</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 下方表格 -->
            <div class="columns is-vcentered">
              <!--欄位名稱 -->
              <div class="column is-1">
                <span class="field">手術日期</span>
              </div>

              <!--表格內容 -->
              <GroupEditable class="is-11 p-0" ref="opGroups">
                <div class="columns is-multiline">
                  <!-- 第1筆資料 -->
                  <div class="column p-0 flex-basis-100" v-for="(oper, index) in diag.MEDICAL_DATA.OPER_DATA" :key="oper.SER_NO">
                    <div class="columns has-flex-column">
                      <div class="column is-1 hor-center">
                        <span class="data">{{ index + 1 }}</span>
                      </div>
                      <div class="column is-narrow">
                        <div class="w-fixed-160 is-flex is-align-items-center">
                          <EditableDatePicker
                            v-model="oper.CFM_STR_DATE"
                            :schema="afterOcrDateSchema.test('required', '不可為空白', (value) => !(oper.CFM_OP_CODE && !value))"
                          ></EditableDatePicker>
                        </div>
                      </div>
                      <div class="column is-4 pr-6">
                        <div class="columns is-gapless w-100">
                          <div class="column mr-2" style="max-width: 110px">
                            <EditableModal
                              v-model:modelText="oper.CFM_OP_CODE"
                              v-model:modelValue="oper.CFM_OP_CODE"
                              v-model:modelValue2="oper.CFM_OP_CTX"
                              v-model:modelValue3="oper.CFM_OP_CNCR"
                              :editingWidth="110"
                              :modal="{
                                component: OperationModal,
                                id: 'surgicalCode',
                                data: {}
                              }"
                            ></EditableModal>
                          </div>
                          <div class="column limit-width" style="max-width: 100%">
                            <ErrorTippy v-if="oper.CFM_STR_DATE && !oper.CFM_OP_CODE" :errors="['請選擇手術代碼']"></ErrorTippy>
                            <EllipseTippy class="limit-width" :content="oper.CFM_OP_CTX" displayBlock manualRefresh>
                              <span class="font-eudc">{{ oper.CFM_OP_CTX }}</span>
                            </EllipseTippy>
                          </div>
                        </div>
                      </div>
                      <div class="column is-1">
                        <span class="data not-editable">{{
                          oper.CFM_OP_CNCR === 'Y' ? '是' : oper.CFM_OP_CNCR === 'N' ? '否' : ''
                        }}</span>
                      </div>
                      <div class="column">
                        <EditableModal
                          v-model:modelText="oper.CFM_OP_PROD"
                          v-model:modelValue="oper.CFM_OP_PROD"
                          :modal="{
                            component: OpProdModal,
                            id: 'selectHospitalModal',
                            data: {
                              opCode: oper.CFM_OP_CODE
                            }
                          }"
                        ></EditableModal>
                      </div>
                      <div class="column" style="min-width: 155px">
                        <EditableDropdown
                          v-model="oper.CFM_OP_GRADE"
                          dynamic="opened"
                          :editingWidth="106"
                          :options="[
                            {
                              name: '請選擇',
                              value: ''
                            },
                            {
                              name: oper.CFM_OP_GRADE_NAME,
                              value: oper.CFM_OP_GRADE,
                              disabled: true
                            }
                          ]"
                          :onRefreshOptions="
                            async () => {
                              return await getOpGradOptions(oper.CFM_OP_PROD);
                            }
                          "
                        ></EditableDropdown>
                        <button
                          class="button is-primary-lightest ml-2 is-editing"
                          v-if="
                            opGroups[currentTabIndex]?.isGroupEditing
                          "
                          @click="deleteOp(oper.SER_NO)"
                        >
                          <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GroupEditable>
            </div>

            <div class="columns">
              <div class="column hor-right">
                <button class="button apply-btn" @click="addOp">
                  <span>新增</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>

          <!-- 其他項目 急診時間 -->
          <div class="part" v-show="diag.MEDICAL_DATA.EMGY_DATA">
            <div class="columns mr-top">
              <div class="column is-1 p-0"></div>
              <div class="column is-11 p-0">
                <div class="columns">
                  <div class="column is-1 hor-center">
                    <span class="field mr-none">序號</span>
                  </div>
                  <div class="column">
                    <div>
                      <span class="field">起訖時間</span>
                    </div>
                  </div>
                  <div class="column"></div>
                </div>
              </div>
            </div>
            <div class="columns is-vcentered">
              <!--欄位名稱 -->
              <div class="column is-1">
                <span class="field">急診時間起訖</span>
              </div>

              <!--表格內容 -->
              <GroupEditable class="is-11 p-0" ref="emgyGroups">
                <div class="columns is-multiline">
                  <!-- 資料 -->
                  <div class="column is-12" v-for="(emgy, index) in diag.MEDICAL_DATA.EMGY_DATA">
                    <div class="columns has-flex-column">
                      <div class="column is-1 hor-center p-0">
                        <span class="data">{{ index + 1 }}</span>
                      </div>
                      <div class="column p-0">
                        <div class="is-flex">
                          <EditableDateRangePicker
                            v-model:modelStartDate="emgy.CFM_STR_DATETIME"
                            v-model:modelEndDate="emgy.CFM_END_DATETIME"
                            :schema="afterOcrDateSchema"
                            :isDatetime="true"
                            :hasRepeatRange="() => detectRepeatRangeDateTime(diag.MEDICAL_DATA.EMGY_DATA, emgy)"
                          ></EditableDateRangePicker>
                        </div>
                      </div>
                      <div class="column p-0 is-7">
                        <span class="field mr-12 is-editing">緊急轉送</span>
                        <EditableCheckbox v-model="emgy.CFM_IS_EMGY"></EditableCheckbox>
                        <button
                          class="button is-primary-lightest ml-5 is-editing"
                          v-if="emgyGroups[currentTabIndex]?.isGroupEditing"
                          @click="deleteEmgy(emgy.SER_NO)"
                        >
                          <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GroupEditable>
            </div>
            <div class="columns">
              <div class="column hor-right">
                <button class="button apply-btn" @click="addEmgy">
                  <span>新增</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>
          <div class="columns has-flex-column" v-if="diag.MEDICAL_DATA.CFM_OTP_CNT !== null">
            <div class="column">
              <span class="field">門診次數</span>
              <EditableInput
                :inputWidth="80"
                v-model="diag.MEDICAL_DATA.CFM_OTP_CNT"
                :schema="
                  string()
                    .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                    .max(3, '最多3位數')
                "
              ></EditableInput>
            </div>
          </div>

          <!-- 新增就醫項目 Button -->
          <div class="part">
            <div class="columns">
              <div class="column hor-right">
                <div class="dropdown is-primary height-limit">
                  <div class="dropdown-trigger">
                    <button class="button apply-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                      <span>新增就醫項目</span>
                      <img src="/src/assets/images/icon-arrow-down-light.svg" alt="ARROW" />
                    </button>
                  </div>
                  <div class="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a
                        v-if="!diag?.MEDICAL_DATA?.STAY_HOSP_INTERVAL"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.STAY_HOSP_INTERVAL = []"
                        >住院起訖</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.DAY_HOSP_INTERVAL"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.DAY_HOSP_INTERVAL = []"
                        >日間病房</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.BURN_HOSP_INTERVAL"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.BURN_HOSP_INTERVAL = []"
                        >燒燙傷病房起訖</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.ICU_INTERVAL"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.ICU_INTERVAL = []"
                        >加護病房起訖</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.HOME_INTERVAL"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.HOME_INTERVAL = []"
                        >在家療養</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.CLINIC_DATA"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.CLINIC_DATA = []"
                        >門診日期</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.RAD_DATA"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.RAD_DATA = []"
                        >放射日期</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.CHEM_DATA"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.CHEM_DATA = []"
                        >化療日期</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.OPER_DATA"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.OPER_DATA = []"
                        >手術日期</a
                      >
                      <a
                        v-if="!diag?.MEDICAL_DATA?.EMGY_DATA"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.EMGY_DATA = []"
                        >急診時間起訖</a
                      >
                      <a
                        v-if="diag?.MEDICAL_DATA?.CFM_OTP_CNT === undefined || diag.MEDICAL_DATA.CFM_OTP_CNT === null"
                        href="#"
                        class="dropdown-item"
                        @click.stop.prevent="diag.MEDICAL_DATA.CFM_OTP_CNT = ''"
                        >門診次數</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden-parts">
            <!-- 額外資料 -->
            <div class="part">
              <h3>額外資料</h3>

              <div class="columns has-flex-column">
                <div class="column is-3" v-if="diag?.CFM_IS_BONE === 'Y' | diag?.CFM_IS_BONE === 'N'">
                  <span class="field mr-12">骨髓移植</span>
                  <EditableCheckbox v-model="diag.CFM_IS_BONE"></EditableCheckbox>
                </div>
                <div class="column is-4" v-if="diag?.EXTRA_DATA?.IS_SEVERE_RA === 'Y' | diag?.EXTRA_DATA?.IS_SEVERE_RA === 'N'">
                  <span class="field mr-12">重度類風溼性關節炎</span>
                  <EditableCheckbox v-model="diag.EXTRA_DATA.IS_SEVERE_RA"></EditableCheckbox>
                </div>
                <div class="column is-5" v-if="diag?.EXTRA_DATA?.IS_SLE === 'Y' | diag?.EXTRA_DATA?.IS_SLE === 'N'">
                  <span class="field mr-12">全身性紅斑狼瘡症</span>
                  <EditableCheckbox v-model="diag.EXTRA_DATA.IS_SLE"></EditableCheckbox>
                </div>
              </div>
            </div>

            <!-- 留院觀察 -->
            <div class="part" v-if="diag.EXTRA_DATA.OBSERV_INTERVAL">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">留院觀察</span>
                </div>
                <GroupEditable class="p-0" :data="diag.EXTRA_DATA.OBSERV_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                  <div class="columns is-multiline has-flex-column">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(observeData, index) in diag.EXTRA_DATA.OBSERV_INTERVAL"
                      :key="index"
                    >
                      <EditableDateRangePicker
                        v-model:modelStartDate="observeData.CFM_STR_DATE"
                        v-model:modelEndDate="observeData.CFM_END_DATE"
                        :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                        :schema="afterOcrDateSchema"
                        :hasRepeatRange="() => detectRepeatRangeDate(diag.EXTRA_DATA.OBSERV_INTERVAL, observeData)"
                        :onClickDelete="
                          isApplyDate(observeData)
                            ? null
                            : () => {
                                onClickDeleteDateRange(diag.EXTRA_DATA.OBSERV_INTERVAL, observeData);
                              }
                        "
                      ></EditableDateRangePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <!-- 出國住院 -->
            <div class="part" v-if="diag.EXTRA_DATA.OVERSEAS_HOSP_INTERVAL">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">出國住院</span>
                </div>
                <GroupEditable class="p-0" :data="diag.EXTRA_DATA.OVERSEAS_HOSP_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                  <div class="columns is-multiline has-flex-column">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(travelData, index) in diag.EXTRA_DATA.OVERSEAS_HOSP_INTERVAL"
                      :key="index"
                    >
                      <EditableDateRangePicker
                        v-model:modelStartDate="travelData.CFM_STR_DATE"
                        v-model:modelEndDate="travelData.CFM_END_DATE"
                        :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                        :schema="afterOcrDateSchema"
                        :hasRepeatRange="() => detectRepeatRangeDate(diag.EXTRA_DATA.OVERSEAS_HOSP_INTERVAL, travelData)"
                        :onClickDelete="
                          isApplyDate(travelData)
                            ? null
                            : () => {
                                onClickDeleteDateRange(diag.EXTRA_DATA.OVERSEAS_HOSP_INTERVAL, travelData);
                              }
                        "
                      ></EditableDateRangePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <!-- 復健日期 -->
            <div class="part" v-if="diag.EXTRA_DATA.REHAB_DATA">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">復健日期</span>
                </div>
                <GroupEditable
                  class="p-0"
                  :data="diag.EXTRA_DATA.REHAB_DATA"
                  :multipleDate="diag.EXTRA_DATA.REHAB_DATA?.map((e) => e.CFM_STR_DATE)"
                  :onClickInsert="onClickInsertMultiDate"
                >
                  <div class="columns is-multiline">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(rehab, index) in diag.EXTRA_DATA.REHAB_DATA"
                      :key="rehab"
                    >
                      <EditableDatePicker
                        v-model="rehab.CFM_STR_DATE"
                        :schema="
                          afterOcrDateSchema.test('repeatDate', '已有相同日期', () => {
                            return repeatDateSchema(diag.EXTRA_DATA.REHAB_DATA, rehab);
                          })
                        "
                        :onClickDelete="isApplyDate(rehab) ? null : () => onClickDeleteDate(diag.EXTRA_DATA.REHAB_DATA, rehab)"
                      ></EditableDatePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <!-- 洗腎日期 -->
            <div class="part" v-if="diag.EXTRA_DATA.HD_DATA">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">洗腎日期</span>
                </div>
                <GroupEditable
                  class="p-0"
                  :data="diag.EXTRA_DATA.HD_DATA"
                  :multipleDate="diag.EXTRA_DATA.HD_DATA?.map((e) => e.CFM_STR_DATE)"
                  :onClickInsert="onClickInsertMultiDate"
                >
                  <div class="columns is-multiline">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(hd, index) in diag.EXTRA_DATA.HD_DATA"
                      :key="hd"
                    >
                      <EditableDatePicker
                        v-model="hd.CFM_STR_DATE"
                        :schema="
                          afterOcrDateSchema.test('repeatDate', '已有相同日期', () => {
                            return repeatDateSchema(diag.EXTRA_DATA.HD_DATA, hd);
                          })
                        "
                        :onClickDelete="isApplyDate(hd) ? null : () => onClickDeleteDate(diag.EXTRA_DATA.HD_DATA, hd)"
                      ></EditableDatePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <!-- 暫留日期 -->
            <div class="part" v-if="diag.EXTRA_DATA.SHORTERM_DATA">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">暫留日期</span>
                </div>
                <GroupEditable
                  class="p-0"
                  :data="diag.EXTRA_DATA.SHORTERM_DATA"
                  :multipleDate="diag.EXTRA_DATA.SHORTERM_DATA?.map((e) => e.CFM_STR_DATE)"
                  :onClickInsert="onClickInsertMultiDate"
                >
                  <div class="columns is-multiline">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(shorterm, index) in diag.EXTRA_DATA.SHORTERM_DATA"
                      :key="shorterm"
                    >
                      <EditableDatePicker
                        v-model="shorterm.CFM_STR_DATE"
                        :schema="
                          afterOcrDateSchema.test('repeatDate', '已有相同日期', () => {
                            return repeatDateSchema(diag.EXTRA_DATA.SHORTERM_DATA, shorterm);
                          })
                        "
                        :onClickDelete="
                          isApplyDate(shorterm) ? null : () => onClickDeleteDate(diag.EXTRA_DATA.SHORTERM_DATA, shorterm)
                        "
                      ></EditableDatePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <div class="part">
              <!-- 重大傷病卡 -->
              <div
                class="columns has-flex-column"
                v-if="
                  (diag?.EXTRA_DATA?.IS_ILL_CARD === 'Y' | diag?.EXTRA_DATA?.IS_ILL_CARD === 'N') ||
                  (diag?.EXTRA_DATA?.IS_MASS_POISON === 'Y' | diag?.EXTRA_DATA?.IS_MASS_POISON === 'N') ||
                  (diag?.EXTRA_DATA?.IS_OVERSEAS === 'Y' | diag?.EXTRA_DATA?.IS_OVERSEAS === 'N')
                "
              >
                <div class="column is-3" v-if="diag?.EXTRA_DATA?.IS_ILL_CARD === 'Y' | diag?.EXTRA_DATA?.IS_ILL_CARD === 'N'">
                  <span class="field mr-67">重大傷病卡</span>
                  <EditableCheckbox v-model="diag.EXTRA_DATA.IS_ILL_CARD"></EditableCheckbox>
                </div>
                <div class="column is-4" v-if="diag?.EXTRA_DATA?.IS_MASS_POISON === 'Y' | diag?.EXTRA_DATA?.IS_MASS_POISON === 'N'">
                  <span class="field mr-12">集體食物中毒</span>
                  <EditableCheckbox v-model="diag.EXTRA_DATA.IS_MASS_POISON"></EditableCheckbox>
                </div>
                <div class="column is-5" v-if="diag?.EXTRA_DATA?.IS_OVERSEAS === 'Y' | diag?.EXTRA_DATA?.IS_OVERSEAS === 'N'">
                  <span class="field mr-12">出差出國</span>
                  <EditableCheckbox v-model="diag.EXTRA_DATA.IS_OVERSEAS"></EditableCheckbox>
                </div>
              </div>
            </div>

            <!-- 安寧病房 -->
            <div class="part" v-if="diag.EXTRA_DATA.HOSPICE_INTERVAL">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">安寧病房</span>
                </div>
                <GroupEditable class="p-0" :data="diag.EXTRA_DATA.HOSPICE_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                  <div class="columns is-multiline has-flex-column">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(hospiceData, index) in diag.EXTRA_DATA.HOSPICE_INTERVAL"
                      :key="index"
                    >
                      <EditableDateRangePicker
                        v-model:modelStartDate="hospiceData.CFM_STR_DATE"
                        v-model:modelEndDate="hospiceData.CFM_END_DATE"
                        :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                        :schema="afterOcrDateSchema"
                        :hasRepeatRange="() => detectRepeatRangeDate(diag.EXTRA_DATA.HOSPICE_INTERVAL, hospiceData)"
                        :onClickDelete="
                          isApplyDate(hospiceData)
                            ? null
                            : () => {
                                onClickDeleteDateRange(diag.EXTRA_DATA.HOSPICE_INTERVAL, hospiceData);
                              }
                        "
                      ></EditableDateRangePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <!-- 疫苗接種 -->
            <div class="part" v-show="diag.EXTRA_DATA.VACCINE_DATA">
              <!-- 上方表頭 -->
              <div class="columns">
                <div class="column is-1 p-0"></div>
                <div class="column is-11 p-0">
                  <div class="columns">
                    <div class="column is-half border-right padding-only-right mr-only-top">
                      <div class="columns">
                        <div class="column is-2 hor-center p-0">
                          <span class="field mr-none">序號</span>
                        </div>
                        <div class="column is-4 p-0">
                          <span class="field">接種日期</span>
                        </div>
                        <div class="column is-7 p-0 ml-3">
                          <span class="field">疫苗接種種類</span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-half padding-only-left mr-only-top">
                      <div class="columns">
                        <div class="column is-2 hor-center p-0">
                          <span class="field mr-none">序號</span>
                        </div>
                        <div class="column is-4 p-0">
                          <span class="field">接種日期</span>
                        </div>
                        <div class="column is-7 p-0 ml-3">
                          <span class="field">疫苗接種種類</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 下方表格 -->
              <div class="columns is-vcentered">
                <!--欄位名稱 -->
                <div class="column is-1">
                  <span class="field">疫苗接種</span>
                </div>

                <!--表格內容 -->
                <GroupEditable class="is-11 p-0" ref="vaccinationGroups">
                  <div class="columns is-multiline">
                    <!-- 第1筆資料 -->
                    <div
                      :class="[
                        'column',
                        'is-half',
                        {
                          'border-right': index % 2 === 0,
                          'padding-only-right': index % 2 === 0,
                          'padding-only-left': index % 2 !== 0
                        }
                      ]"
                      v-for="(vaccine, index) in diag.EXTRA_DATA.VACCINE_DATA"
                      :key="vaccine.SER_NO"
                    >
                      <div class="columns has-flex-column">
                        <div class="column is-2 hor-center">
                          <span class="data">{{ index + 1 }}</span>
                        </div>
                        <div class="column is-4">
                          <EditableDatePicker v-model="vaccine.CFM_STR_DATE"></EditableDatePicker>
                        </div>
                        <div class="column is-7 ml-3">
                          <EditableDropdown
                            v-model="vaccine.CFM_PREVENT_FROM"
                            :editingWidth="150"
                            :options="[
                              {
                                name: '預防流行性感冒',
                                value: '1'
                              },
                              {
                                name: '嚴重特殊傳染性肺炎(COVID 19)',
                                value: '2'
                              },
                              {
                                name: '鏈球菌感染',
                                value: '3'
                              }
                            ]"
                          ></EditableDropdown>
                          <button
                            class="button is-primary-lightest ml-2 is-editing"
                            v-if="vaccinationGroups[currentTabIndex]?.isGroupEditing && !isApplyDate(vaccine)"
                            @click="deleteVaccination(vaccine.SER_NO)"
                          >
                            <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GroupEditable>
              </div>

              <div class="columns">
                <div class="column hor-right">
                  <button class="button apply-btn" @click="addVaccination">
                    <span>新增</span>
                    <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 癌症篩選 -->
            <div class="part" v-show="diag.EXTRA_DATA.CANCER_SCR_DATA">
              <!-- 上方表頭 -->
              <div class="columns">
                <div class="column is-1 p-0"></div>
                <div class="column is-11 p-0">
                  <div class="columns">
                    <div class="column is-half border-right padding-only-right mr-only-top">
                      <div class="columns">
                        <div class="column is-2 hor-center p-0">
                          <span class="field mr-none">序號</span>
                        </div>
                        <div class="column is-4 p-0">
                          <span class="field">篩選日期</span>
                        </div>
                        <div class="column is-7 p-0 ml-3">
                          <span class="field">癌症篩選種類</span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-half padding-only-left mr-only-top">
                      <div class="columns">
                        <div class="column is-2 hor-center p-0">
                          <span class="field mr-none">序號</span>
                        </div>
                        <div class="column is-4 p-0">
                          <span class="field">篩選日期</span>
                        </div>
                        <div class="column is-7 p-0 ml-3">
                          <span class="field">癌症篩選種類</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 下方表格 -->
              <div class="columns is-vcentered">
                <!--欄位名稱 -->
                <div class="column is-1">
                  <span class="field">癌症篩選</span>
                </div>

                <!--表格內容 -->
                <GroupEditable class="is-11 p-0" ref="cancerScreeningGroups">
                  <div class="columns is-multiline">
                    <!-- 第1筆資料 -->
                    <div
                      :class="[
                        'column',
                        'is-half',
                        {
                          'border-right': index % 2 === 0,
                          'padding-only-right': index % 2 === 0,
                          'padding-only-left': index % 2 !== 0
                        }
                      ]"
                      v-for="(cancer, index) in diag.EXTRA_DATA.CANCER_SCR_DATA"
                      :key="cancer.SER_NO"
                    >
                      <div class="columns has-flex-column">
                        <div class="column is-2 hor-center">
                          <span class="data">{{ index + 1 }}</span>
                        </div>
                        <div class="column is-4">
                          <EditableDatePicker v-model="cancer.CFM_STR_DATE" :schema="afterOcrDateSchema"></EditableDatePicker>
                        </div>
                        <div class="column is-7 ml-3">
                          <EditableDropdown
                            v-model="cancer.CFM_PREVENT_FROM"
                            :editingWidth="200"
                            :options="[
                              {
                                name: '乳癌-乳房X光攝影檢查',
                                value: '1'
                              },
                              {
                                name: '子宮頸癌-子宮頸抹片檢查',
                                value: '2'
                              },
                              {
                                name: '大腸癌-糞便潛血檢查',
                                value: '3'
                              },
                              {
                                name: '口腔癌-口腔黏膜檢查',
                                value: '4'
                              }
                            ]"
                          ></EditableDropdown>
                          <button
                            class="button is-primary-lightest ml-2 is-editing"
                            v-if="cancerScreeningGroups[currentTabIndex]?.isGroupEditing && !isApplyDate(cancer)"
                            @click="deleteCancerScreening(cancer.SER_NO)"
                          >
                            <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GroupEditable>
              </div>

              <div class="columns">
                <div class="column hor-right">
                  <button class="button apply-btn" @click="addCancerScreening">
                    <span>新增</span>
                    <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 癌症藥物 -->
            <div class="part" v-show="diag.EXTRA_DATA.CANCER_DRUG_DATA">
              <!-- 上方表頭 -->
              <div class="columns">
                <div class="column is-1 p-0"></div>
                <div class="column is-11 p-0">
                  <div class="columns">
                    <div class="column is-half border-right padding-only-right mr-only-top">
                      <div class="columns">
                        <div class="column is-2 hor-center p-0">
                          <span class="field mr-none">序號</span>
                        </div>
                        <div class="column is-4 p-0">
                          <span class="field">治療日期</span>
                        </div>
                        <div class="column is-7 p-0 ml-3">
                          <span class="field">癌症藥物種類</span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-half padding-only-left mr-only-top">
                      <div class="columns">
                        <div class="column is-2 hor-center p-0">
                          <span class="field mr-none">序號</span>
                        </div>
                        <div class="column is-4 p-0">
                          <span class="field">治療日期</span>
                        </div>
                        <div class="column is-7 p-0 ml-3">
                          <span class="field">癌症藥物種類</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 下方表格 -->
              <div class="columns is-vcentered">
                <!--欄位名稱 -->
                <div class="column is-1">
                  <span class="field">癌症藥物</span>
                </div>

                <!--表格內容 -->
                <GroupEditable class="is-11 p-0" ref="cancerDrugGroups">
                  <div class="columns is-multiline">
                    <!-- 第1筆資料 -->
                    <div
                      :class="[
                        'column',
                        'is-half',
                        {
                          'border-right': index % 2 === 0,
                          'padding-only-right': index % 2 === 0,
                          'padding-only-left': index % 2 !== 0
                        }
                      ]"
                      v-for="(cancer, index) in diag.EXTRA_DATA.CANCER_DRUG_DATA"
                      :key="cancer.SER_NO"
                    >
                      <div class="columns has-flex-column">
                        <div class="column is-2 hor-center">
                          <span class="data">{{ index + 1 }}</span>
                        </div>
                        <div class="column is-4">
                          <EditableDatePicker v-model="cancer.CFM_STR_DATE" :schema="afterOcrDateSchema"></EditableDatePicker>
                        </div>
                        <div class="column is-7 ml-3">
                          <EditableDropdown
                            v-model="cancer.CFM_PREVENT_FROM"
                            :editingWidth="200"
                            :options="[
                              {
                                name: '標靶藥物',
                                value: '1'
                              },
                              {
                                name: '特定粒子',
                                value: '2'
                              },
                              {
                                name: '自體免疫細胞治療',
                                value: '3'
                              },
                              {
                                name: '白血病骨髓或幹細胞移植',
                                value: '4'
                              },
                              {
                                name: '惡性淋巴瘤骨髓或幹細胞移植',
                                value: '5'
                              }
                            ]"
                          ></EditableDropdown>
                          <button
                            class="button is-primary-lightest ml-2 is-editing"
                            v-if="cancerDrugGroups[currentTabIndex]?.isGroupEditing && !isApplyDate(cancer)"
                            @click="deleteCancerDrug(cancer.SER_NO)"
                          >
                            <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GroupEditable>
              </div>

              <div class="columns">
                <div class="column hor-right">
                  <button class="button apply-btn" @click="addCancerDrug">
                    <span>新增</span>
                    <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 法定傳染病 -->
            <div class="part" v-if="diag.EXTRA_DATA.NOTIF_DISEASE_INTERVAL">
              <div class="columns is-align-items-center">
                <div class="column is-narrow fixed-width-143 p-0">
                  <span class="field">法定傳染病</span>
                </div>
                <GroupEditable class="p-0" :data="diag.EXTRA_DATA.NOTIF_DISEASE_INTERVAL" :onClickInsert="onClickInsertRangeDate">
                  <div class="columns is-multiline has-flex-column">
                    <div
                      :class="[
                        'column',
                        { 'is-3': index % 3 === 0, 'is-4': index % 3 !== 0, 'w-30-percent': index % 3 === 0 },
                        'p-0',
                        'has-margin',
                        { 'hor-center': index % 3 !== 0, 'border-right': (index + 1) % 3 !== 0 }
                      ]"
                      v-for="(notifiableDisease, index) in diag.EXTRA_DATA.NOTIF_DISEASE_INTERVAL"
                      :key="index"
                    >
                      <EditableDateRangePicker
                        v-model:modelStartDate="notifiableDisease.CFM_STR_DATE"
                        v-model:modelEndDate="notifiableDisease.CFM_END_DATE"
                        :class="{ 'is-justify-content-flex-end': index % 3 === 0 }"
                        :schema="afterOcrDateSchema"
                        :hasRepeatRange="() => detectRepeatRangeDate(diag.EXTRA_DATA.NOTIF_DISEASE_INTERVAL, notifiableDisease)"
                        :onClickDelete="
                          isApplyDate(notifiableDisease)
                            ? null
                            : () => {
                                onClickDeleteDateRange(diag.EXTRA_DATA.NOTIF_DISEASE_INTERVAL, notifiableDisease);
                              }
                        "
                      ></EditableDateRangePicker>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>

            <!-- 新增額外項目 Button -->
            <div class="part">
              <div class="columns">
                <div class="column hor-right mr-only-bot">
                  <button
                  v-if="diag.MAN_ISRT_IND === 'Y'"
                  class="button is-danger is-outlined mr-5"
                  @click="deleteDiag(diag.DIAG_SER_NO)"
                >
                  <span>刪除診斷書 {{ diagIndex + 1 }}</span>
                  </button>
                  <div class="dropdown is-primary height-limit">
                    <div class="dropdown-trigger">
                      <button class="button apply-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>新增額外項目</span>
                        <img src="/src/assets/images/icon-arrow-down-light.svg" alt="ARROW" />
                      </button>
                    </div>
                    <div class="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <a
                          v-if="diag?.CFM_IS_BONE != 'Y' & diag?.CFM_IS_BONE != 'N'"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.CFM_IS_BONE = 'Y'"
                          >骨髓移植</a
                        >
                        <a
                          v-if="diag?.EXTRA_DATA?.IS_SEVERE_RA != 'Y' & diag?.EXTRA_DATA?.IS_SEVERE_RA != 'N'"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.IS_SEVERE_RA = 'Y'"
                          >重度類風溼性關節炎</a
                        >
                        <a
                          v-if="diag?.EXTRA_DATA?.IS_SLE != 'Y' & diag?.EXTRA_DATA?.IS_SLE != 'N'"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.IS_SLE = 'Y'"
                          >全身性紅斑狼瘡症</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.OBSERV_INTERVAL"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.OBSERV_INTERVAL = []"
                          >留院觀察</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.OVERSEAS_HOSP_INTERVAL"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.OVERSEAS_HOSP_INTERVAL = []"
                          >出國住院</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.REHAB_DATA"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.REHAB_DATA = []"
                          >復健日期</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.HD_DATA"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.HD_DATA = []"
                          >洗腎日期</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.SHORTERM_DATA"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.SHORTERM_DATA = []"
                          >暫留日期</a
                        >
                        <a
                          v-if="diag?.EXTRA_DATA?.IS_ILL_CARD != 'Y' & diag?.EXTRA_DATA?.IS_ILL_CARD != 'N'"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.IS_ILL_CARD = 'Y'"
                          >重大傷病卡</a
                        >
                        <a
                          v-if="diag?.EXTRA_DATA?.IS_MASS_POISON != 'Y' & diag?.EXTRA_DATA?.IS_MASS_POISON != 'N'"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.IS_MASS_POISON = 'Y'"
                          >集體食物中毒</a
                        >
                        <a
                          v-if="diag?.EXTRA_DATA?.IS_OVERSEAS != 'Y' & diag?.EXTRA_DATA?.IS_OVERSEAS != 'N'"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.IS_OVERSEAS = 'Y'"
                          >出差出國</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.HOSPICE_INTERVAL"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.HOSPICE_INTERVAL = []"
                          >安寧病房</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.VACCINE_DATA"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.VACCINE_DATA = []"
                          >疫苗接種</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.CANCER_SCR_DATA"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.CANCER_SCR_DATA = []"
                          >癌症篩選</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.CANCER_DRUG_DATA"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.CANCER_DRUG_DATA = []"
                          >癌症藥物</a
                        >
                        <a
                          v-if="!diag?.EXTRA_DATA?.NOTIF_DISEASE_INTERVAL"
                          href="#"
                          class="dropdown-item"
                          @click.stop.prevent="diag.EXTRA_DATA.NOTIF_DISEASE_INTERVAL = []"
                          >法定傳染病</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Tab>
      <template v-slot:buttons>
        <button class="button apply-btn no-bg-btn" @click="addDiagArea">
          <span>新增診斷書</span>
          <img src="/src/assets/images/icon-add.svg" alt="ADD" />
        </button>
      </template>
    </Tabs>
  </div>
</template>
<script setup>
  import { difference, isEmpty, pull, remove } from 'lodash-es';
import { nextTick } from 'vue';
import { string } from 'yup';
import { sequence } from '~/common/utils';
import EditableCheckbox from '~/components/Editable/EditableCheckbox.vue';
import EditableDatePicker from '~/components/Editable/EditableDatePicker.vue';
import EditableDateRangePicker from '~/components/Editable/EditableDateRangePicker.vue';
import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
import EditableInput from '~/components/Editable/EditableInput.vue';
import EditableModal from '~/components/Editable/EditableModal.vue';
import EditableMutipleDropdown from '~/components/Editable/EditableMutipleDropdown.vue';
import ErrorTippy from '~/components/Editable/ErrorTippy.vue';
import GroupEditable from '~/components/Editable/GroupEditable.vue';
import EllipseTippy from '~/components/EllipseTippy.vue';
import Tab from '~/components/Tabs/Tab.vue';
import Tabs from '~/components/Tabs/Tabs.vue';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import { useApplyStore } from '~/stores/apply';
import { scrollToElement } from '../../../../common/utils';
import BoneFractureModal from './Modals/BoneFractureModal.vue';
import CancerCategoryModal from './Modals/CancerCategoryModal.vue';
import DoctorBranchModal from './Modals/DoctorBranchModal.vue';
import HospitalModal from './Modals/HospitalModal.vue';
import ICDModal from './Modals/ICDModal.vue';
import OperationModal from './Modals/OperationModal.vue';
import OpProdModal from './Modals/OpProdModal.vue';

  const props = defineProps({
    diagData: {
      type: Object,
      required: true,
      default: {}
    }
  });
  const applyStore = useApplyStore();
  const { $swal } = useSwal();
  const { getROCDate, getDate, isSameOrAfter } = useMoment();
  const diagData = toRef(props, 'diagData');
  // 只顯示不是D的
  const showingDiags = computed(() =>
    diagData.value?.DIAG_DATA ? diagData.value?.DIAG_DATA.filter((e) => e.ACT_CD !== 'D') : []
  );

  // Group
  // 日間病房
  const dayWardGroups = ref([]);
  // 疫苗接踵
  const vaccinationGroups = ref([]);
  // 癌症篩選
  const cancerScreeningGroups = ref([]);
  // 癌症藥物
  const cancerDrugGroups = ref([]);
  // 手術日期
  const opGroups = ref([]);
  // 急診時間
  const emgyGroups = ref([]);
  // 住院起訖
  const stayHospitalGroups = ref([]);
  // 診斷病名
  const icdGroups = ref([]);

  // 取得手術等級下拉選單
  const getOpGradOptions = async (prod) => {
    try {
      let options = [{ name: '請選擇', value: '', selected: true }];
      if (!prod) {
        return options;
        // throw 'EMPTY OP PROD';
      }
      let grads = await applyStore.getOPProdOrGrad('GRAD', prod);

      grads.forEach((e) => {
        options.push({
          name: e.OP_GRAD_KEY,
          value: e.OP_GRAD_VALUE
        });
      });
      return options;
    } catch (e) {
      console.error(e);
      return [{ name: '請選擇', value: '' }];
    }
  };

  const diagArea = ref(null);
  const diagTabs = ref(null);
  // 目前停留在哪個頁籤
  const currentTabIndex = ref(0);
  // 目前顯示哪份診斷書
  const currentDiagIndex = ref(0);
  // 頁籤切換時Trigger
  const onTabChanged = (index, id) => {
    console.log('tab change' + index);
    currentTabIndex.value = index;
  };

  watch(currentTabIndex, (newValue) => {
    currentDiagIndex.value = diagData.value.DIAG_DATA.findIndex(
      (e) => e.DIAG_SER_NO === showingDiags.value[newValue].DIAG_SER_NO
    );
  });

  // 新增多筆日期
  const onClickInsertMultiDate = async (data, dates, event, javaClass) => {
    // 挑出要新增的日期
    let newDates = difference(
      dates.map((m) => getDate(m)),
      data.map((m) => getDate(m.CFM_STR_DATE))
    );
    console.log(newDates);
    // 新增日期
    newDates.forEach((date) => {
      const serNo = sequence(data, 'SER_NO');
      console.log(serNo);
      data.push({
        SER_NO: serNo.toString(),
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo11',
        CFM_STR_DATE: getDate(date),
        MAN_ISRT_IND: 'Y'
      });
    });

    // 排序 => 排序改到GroupEditable內做watch排序
    // let orderData = orderBy(data, 'CFM_STR_DATE', 'asc');
    // data.length = 0;
    // data.push(...orderData);
    // console.log(data);
  };

  // 新增日期區間
  const onClickInsertRangeDate = async (data, event, javaClass) => {
    // console.log(data);
    if (data.some((e) => isEmpty(e.CFM_STR_DATE))) {
      $swal.warning('請先輸入上一個日期區間');
    } else {
      const serNo = sequence(data, 'SER_NO');
      console.log(serNo);
      data.push({
        SER_NO: serNo.toString(),
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo10',
        CFM_END_DATE: '',
        CFM_STR_DATE: '',
        MAN_ISRT_IND: 'Y'
      });
    }
  };

  // 正版診斷書影像按鈕
  const onClickDiagVideo = (hospitalCode) => {
    if (hospitalCode) {
      window.open(
        `/servlet/HttpDispatcher/AAZ0_0404/query?SYS_NO=AA&SUB_SYS_NO=Z1&FUNC_ID=AAZ10101&isShowQueryItem=R&PARAM_1=${hospitalCode}`
      );
    } else {
      $swal.warning('請先選擇醫院');
    }
  };

  // 新增日間病房
  const addDayWard = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.DAY_HOSP_INTERVAL, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.DAY_HOSP_INTERVAL.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo10',
      SER_NO: serNo.toString(),
      DAYS_SUM: '',
      CFM_STR_DATE: '',
      CFM_END_DATE: '',
      MAN_ISRT_IND: 'Y' // 手動新增標記
    });
    dayWardGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 刪除日間病房
  const deleteDayWard = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.DAY_HOSP_INTERVAL, (e) => e.SER_NO === serNo);
  };

  // 新增疫苗接踵
  const addVaccination = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.VACCINE_DATA, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.VACCINE_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo11',
      SER_NO: serNo.toString(),
      CFM_STR_DATE: '',
      CFM_PREVENT_FROM: '',
      MAN_ISRT_IND: 'Y'
    });
    vaccinationGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 刪除疫苗接踵
  const deleteVaccination = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.VACCINE_DATA, (e) => e.SER_NO === serNo);
  };

  // 新增癌症篩選
  const addCancerScreening = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.CANCER_SCR_DATA, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.CANCER_SCR_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo11',
      SER_NO: serNo.toString(),
      CFM_STR_DATE: '',
      CFM_PREVENT_FROM: '',
      MAN_ISRT_IND: 'Y'
    });
    cancerScreeningGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 刪除癌症篩選
  const deleteCancerScreening = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.CANCER_SCR_DATA, (e) => e.SER_NO === serNo);
  };

  // 新增癌症藥物
  const addCancerDrug = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.CANCER_DRUG_DATA, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.CANCER_DRUG_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo11',
      SER_NO: serNo.toString(),
      CFM_STR_DATE: '',
      CFM_PREVENT_FROM: '',
      MAN_ISRT_IND: 'Y'
    });
    cancerDrugGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 刪除癌症藥物
  const deleteCancerDrug = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].EXTRA_DATA.CANCER_DRUG_DATA, (e) => e.SER_NO === serNo);
  };

  // 新增手術
  const addOp = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.OPER_DATA, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.OPER_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo12',
      SER_NO: serNo.toString(),
      CFM_STR_DATE: '',
      CFM_OP_CODE: '',
      PRE_OP_CODE: '',
      CFM_OP_GRADE: '',
      CFM_OP_CTX: '',
      CFM_OP_PROD: '',
      CFM_OP_CNCR: '',
      MAN_ISRT_IND: 'Y'
    });
    opGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 新增急診時間
  const addEmgy = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.EMGY_DATA, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.EMGY_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo13',
      SER_NO: serNo,
      CFM_IS_EMGY: '',
      CFM_STR_DATETIME: '',
      CFM_END_DATETIME: '',
      MAN_ISRT_IND: 'Y'
    });
    emgyGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 刪除手術
  const deleteOp = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.OPER_DATA, (e) => e.SER_NO === serNo);
  };

  const deleteEmgy = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.EMGY_DATA, (e) => e.SER_NO === serNo);
  };

  // 取得連結收據下拉選項
  const getReceiptLinkOptions = (serNos) => {
    // 需留意，刪掉收據的話要跟著動
    // console.log(serNos);
    const getIsChecked = (serNo) => (serNos ? serNos.split(',').includes(serNo) : false);
    const receipts = applyStore.receiptData?.RECEIPT_DATA?.filter((e) => e.ACT_CD !== 'D').map((m, index) => ({
      text: `收據${index + 1}`,
      value: m.SER_NO,
      checked: getIsChecked(m.SER_NO)
    }));
    return reactive(receipts);
  };

  // 新增住院
  const addStayHospital = () => {
    const serNo = sequence(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.STAY_HOSP_INTERVAL, 'SER_NO');
    diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.STAY_HOSP_INTERVAL.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo10',
      SER_NO: serNo.toString(),
      RECEIPT_SER_NOS: '',
      CFM_STR_DATE: '',
      CFM_END_DATE: '',
      CHG_CODE: '',
      MAN_ISRT_IND: 'Y'
    });
    console.log(stayHospitalGroups.value);
    stayHospitalGroups.value[currentTabIndex.value]?.refreshGroup();
  };

  // 刪除住院
  const deleteStayHospital = (serNo) => {
    remove(diagData.value.DIAG_DATA[currentDiagIndex.value].MEDICAL_DATA.STAY_HOSP_INTERVAL, (e) => e.SER_NO === serNo);
  };

  // 新增一整個診斷書
  const addDiagArea = () => {
    const serNo = sequence(diagData.value.DIAG_DATA, 'DIAG_SER_NO');
    diagData.value.DIAG_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo3',
      DIAG_SER_NO: serNo.toString(),
      ACT_CD: 'A',
      MAN_ISRT_IND: 'Y',
      HOSP_CODE: '',
      HOSP_NAME: '',
      DOC_LISN_NO: '',
      DOC_NAME: '',
      DIAG_CTX: '',
      CFM_DIAG_DIS: '',
      IS_SOC_INSU: '',
      CFM_ICD_CODE1: '',
      CFM_ICD_NAME1: '',
      CFM_ICD_CODE2: '',
      CFM_ICD_NAME2: '',
      CFM_ICD_CODE3: '',
      CFM_ICD_NAME3: '',
      CFM_ICD_CODE4: '',
      CFM_ICD_NAME4: '',
      CFM_ICD_NAME5: '',
      CFM_ICD_CODE5: '',
      CFM_OP_GRADE: '',
      CANCER_DATA: null,
      CFM_DAY_HOSP: '',
      BONE_CODE_DATA: null,
      CFM_IS_BONE: '',
      CFM_OTP_CNT: '0',
      CFM_MAIN_DEPCD: '',
      CFM_SUB_DEPCD: '',
      CFM_MAIN_DEPNM: '',
      CFM_SUB_DEPNM: '',
      KEYIN3_IS_OP: '',
      MEDICAL_DATA: {
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo14',
        DAY_HOSP_INTERVAL: null,
        STAY_HOSP_INTERVAL: null,
        BURN_HOSP_INTERVAL: null,
        ICU_INTERVAL: null,
        HOME_INTERVAL: null,
        CLINIC_DATA: null,
        RAD_DATA: null,
        CHEM_DATA: null,
        OPER_DATA: null,
        EMGY_DATA: null,
        CFM_OTP_CNT: null // String
      },
      EXTRA_DATA: {
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo15',
        IS_SEVERE_RA: '',
        IS_SLE: '',
        OBSERV_INTERVAL: null,
        OVERSEAS_HOSP_INTERVAL: null,
        REHAB_DATA: null,
        HD_DATA: null,
        SHORTERM_DATA: null,
        IS_ILL_CARD: '',
        IS_MASS_POISON: '',
        IS_OVERSEAS: '',
        HOSPICE_INTERVAL: null,
        VACCINE_DATA: null,
        CANCER_SCR_DATA: null,
        CANCER_DRUG_DATA: null,
        NOTIF_DISEASE_INTERVAL: null
      }
    });
  };

  // 刪除一整個診斷書
  const deleteDiag = (serNo) => {
    $swal.confirm('您確定要刪除嗎？', async () => {
      // remove(diagData.value.DIAG_DATA, (e) => e.DIAG_SER_NO === serNo);
      let rDiag = diagData.value.DIAG_DATA.find((e) => e.DIAG_SER_NO === serNo);
      if (rDiag) rDiag.ACT_CD = 'D';

      // 切換至上一個頁籤
      if (currentTabIndex.value >= 1) {
        currentTabIndex.value -= 1;
        await nextTick();
        console.log(diagTabs);
        diagTabs.value?.setActive(currentTabIndex.value);
        // 移至診斷書上方
        scrollToElement(diagArea.value, 80, 'smooth');
      }
    });
  };

  // 清除疾病
  const clearICD = (no) => {
    diagData.value.DIAG_DATA[currentDiagIndex.value][`CFM_ICD_CODE${no}`] = '';
    diagData.value.DIAG_DATA[currentDiagIndex.value][`CFM_ICD_NAME${no}`] = '';
  };

  // 是否有骨折換算資料
  const hasBoneData = computed(() =>
    diagData.value.DIAG_DATA.some(
      (diag) => diag.BONE_CODE_DATA && diag.BONE_CODE_DATA.length > 0 && diag.BONE_CODE_DATA[0].CFM_BONE_CODE
    )
  );
  // console.log(hasBoneData.value);
  const afterOcrDateSchema = string()
    .nullable()
    .test(
      'after-ocrDate',
      '該日期不可早於事故日',
      (value) => isEmpty(value) || isEmpty(applyStore.claimData.OCR_DATE) || isSameOrAfter(value, applyStore.claimData.OCR_DATE)
    );

  const detectRepeatRangeDate = (data, current) =>
    data.filter(
      (e) => e.CFM_STR_DATE && e.CFM_END_DATE && e.CFM_STR_DATE <= current.CFM_END_DATE && e.CFM_END_DATE >= current.CFM_STR_DATE
      // (e) =>
      //   e.CFM_STR_DATE && e.CFM_END_DATE && e.CFM_STR_DATE === current.CFM_STR_DATE && e.CFM_END_DATE === current.CFM_END_DATE
    ).length > 1;

  const detectRepeatRangeDateTime = (data, current) =>
    data.filter(
      (e) =>
        e.CFM_STR_DATETIME &&
        e.CFM_END_DATETIME &&
        e.CFM_STR_DATETIME <= current.CFM_END_DATETIME &&
        e.CFM_END_DATETIME >= current.CFM_STR_DATETIME
      // (e) =>
      //   e.CFM_STR_DATE && e.CFM_END_DATE && e.CFM_STR_DATE === current.CFM_STR_DATE && e.CFM_END_DATE === current.CFM_END_DATE
    ).length > 1;

  const repeatDateSchema = (data, current) =>
    data.filter((e) => e.CFM_STR_DATE && e.CFM_STR_DATE === current.CFM_STR_DATE).length <= 1;

  const repeatDateTimeSchema = (data, current) =>
    data.filter((e) => getDate(e.CFM_STR_DATETIME) && getDate(e.CFM_STR_DATETIME) === getDate(current.CFM_STR_DATE)).length <= 1;

  // 新增癌症資料
  const addCancerData = (diag) => {
    diag.CANCER_DATA = [
      {
        CFM_CANCER_NO: '',
        CFM_CANCER_NAME: '',
        CFM_CANCER_STG: '',
        CFM_CANCER_DATE: '',
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo17'
      }
    ];
  };

  const addBoneCodeData = (diag) => {
    diag.BONE_CODE_DATA = [
      {
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo18',
        CFM_BONE_NAME: '',
        CFM_BONE_CODE: ''
      }
    ];
  };

  const isApplyDate = (data) => data?.APLY_STR_DATE || data?.APLY_END_DATE || 'APLY_STR_DATE' in data || 'APLY_END_DATE' in data;

  const isApplyData = (data, applyFields) => {
    // debugger;
    let result = false;
    for (const field of applyFields) {
      if (field in data) {
        result = true;
        break;
      }
    }
    return result;
  };

  // 日期區間的垃圾桶
  const onClickDeleteDateRange = (data, current) => {
    // // 受理資料
    // if (current.APLY_STR_DATE || current.APLY_END_DATE) {
    //   // 清除值即可
    //   current.CFM_STR_DATE = '';
    //   current.CFM_END_DATE = '';
    // } else {
    //   // 非受理資料，刪除整個欄位
    //   pull(data, current);
    // }
    // 改為整個刪除，受理資料不會有垃圾桶
    pull(data, current);
  };

  //單筆日期的垃圾桶
  const onClickDeleteDate = (data, current) => {
    // // 受理資料
    // if (isApplyDate(current)) {
    //   // 清除值
    //   current.CFM_STR_DATE = '';
    // } else {
    //   // 非受理資料，刪除整個欄位
    //   pull(data, current);
    // }
    // 改為整個刪除，受理資料不會有垃圾桶
    pull(data, current);
  };
</script>
