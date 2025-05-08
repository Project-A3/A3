<template>
  <div class="card is-full second-card" id="ApplySecondCard">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn"></button>

    <!-- 事故/索賠資料 -->
    <h2 class="sticky-basic-info">事故/索賠資料</h2>

    <div class="part border-none">
      <div class="columns has-flex-column">
        <!-- <div class="column is-one-quarter">
          <span class="field">申請險別</span>
          <span class="data not-editable">
            {{ handleProdCat(claimData.PROD_CAT) }}
          </span>
        </div> -->
        <div class="column is-one-quarter">
          <span class="field">申請種類</span>
          <EditableDropdown
            v-model="claimData.CFM_APLY_KIND"
            :options="[
              { name: '疾病', value: '1' },
              { name: '意外', value: '2' }
            ]"
            :schema="string().required('請選擇申請種類').max(1)"
          ></EditableDropdown>
        </div>
        <div class="column is-one-quarter pr-2">
          <span class="field">事故原因</span>
          <EditableModal
            v-model:modelText="ocrReason"
            v-model:modelValue="claimData.OCR_RESN"
            v-model:modelValue2="claimData.OCR_RESN_NAME"
            :modal="{
              component: AccidentReasonModal,
              id: 'manualApprovedEditReason',
              data: {}
            }"
            :schema="string().required('請選擇事故原因')"
          ></EditableModal>
        </div>
        <div class="column">
          <span class="field">事故原因內容</span>
          <span class="data not-editable font-eudc">{{ claimData.OCR_RESN_CTX }}</span>
        </div>
      </div>
      <div class="columns has-flex-column">
        <div class="column is-half pr-2">
          <span class="field">索賠類別</span>
          <EditableModal
            v-model:modelText="claimCatText"
            v-model:modelValue="claimData.CFM_CLAM_CAT"
            v-model:modelValue2="claimData.CFM_CLAM_CAT_NAME"
            :editingStyle="{ maxWidth: '500px' }"
            :modal="{
              component: ClaimCategoryModal,
              id: 'modifyCategoryModal',
              data: {
                prodCat: claimData.PROD_CAT
              }
            }"
            :schema="string().required('請選擇索賠類別')"
          ></EditableModal>
        </div>
        <div class="column is-one-quarter">
          <span class="field has-tippy mr-37" data-tippy-content="資料資料" :schema="string().required('請輸入事故日期')"
            >事故日</span
          >
          <EditableDatePicker v-model="claimData.OCR_DATE"></EditableDatePicker>
        </div>
        <div class="column is-one-quarter">
          <span class="field">事故職等</span>
          <EditableDropdown
            :editingWidth="110"
            v-model="claimData.JOB_ID"
            :schema="
              string()
                .nullable()
                .test('required', '請選擇事故職等', (value) => !(claimData.CFM_APLY_KIND === '2' && (!value || !value.trim())))
            "
            :options="[
              { name: '1', value: '1' },
              { name: '2', value: '2' },
              { name: '3', value: '3' },
              { name: '4', value: '4' },
              { name: '5', value: '5' },
              { name: '6', value: '6' },
              { name: '非工作中事故', value: '9' }
            ]"
          ></EditableDropdown>
        </div>
      </div>
    </div>

    <!-- 檢警資料 -->
    <div class="part" v-if="!isLifeSchool && claimData.policeRept">
      <h3>檢警資料</h3>

      <div class="columns has-flex-column">
        <div class="column is-half">
          <span class="field">事故地點</span>
          <EditableInput
            :fitContent="true"
            v-model="claimData.policeRept.OCR_PLCE_ADDR"
            :schema="string().max(80, '最多80個字')"
          ></EditableInput>
        </div>
        <div class="column is-half limit-width">
          <span class="field">事故經過</span>
          <EditableInput
            :fitContent="true"
            v-model="claimData.policeRept.OCR_STORY"
            :tippy="claimData.policeRept.OCR_STORY"
            :schema="string().max(80, '最多80個字')"
          ></EditableInput>
        </div>
      </div>
      <div class="columns has-flex-column">
        <div class="column is-narrow">
          <span class="field mr-12">報案</span>
          <span class="data not-editable"
            ><img
              v-if="!isEmpty(claimData.policeRept.REPT_DATE)"
              src="/src/assets/images/icon-checkmark-check.svg"
              alt="CHECKMARK"
            /><template v-else>無</template></span
          >
        </div>
        <div class="column is-2 pl-5" style="width: 270px">
          <span class="field mr-2">報案日期</span>
          <EditableDatePicker v-model="claimData.policeRept.REPT_DATE" :schema="afterOcrDateSchema"></EditableDatePicker>
        </div>
        <div class="column" style="min-width: 180px">
          <span class="field">報案機關</span>
          <EditableInput
            :inputWidth="160"
            v-model="claimData.policeRept.REPT_COP_DEPT"
            :schema="string().max(20, '最多20字')"
          ></EditableInput>
        </div>
        <div class="column is-3" style="min-width: 330px">
          <span class="field">報案機關電話</span>
          <GroupEditable class="is-3">
            <div class="columns is-align-items-center is-gapless">
              <div class="column is-narrow" style="padding-right: 0 !important">
                <EditableInput
                  v-model="claimData.policeRept.REPT_COP_AREA"
                  placeholder=""
                  :inputStyle="{
                    padding: '8px 0 8px 5px',
                    width: '43px'
                  }"
                  :schema="
                    string()
                      .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                      .max(4, '最多4個數字')
                  "
                ></EditableInput>
              </div>
              <div class="column is-narrow">-</div>
              <div class="column is-narrow" style="padding-right: 0 !important">
                <EditableInput
                  v-model="claimData.policeRept.REPT_COP_TEL"
                  :inputStyle="{ width: '88px', padding: '8px 0 8px 4px' }"
                  :schema="
                    string()
                      .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                      .max(8, '最多8個數字')
                  "
                ></EditableInput>
              </div>
              <div class="column is-narrow">#</div>
              <div class="column is-3" style="min-width: 58px">
                <EditableInput
                  v-model="claimData.policeRept.REPT_COP_EXT"
                  :inputStyle="{
                    width: '58px',
                    padding: '8px 0 8px 4px'
                  }"
                  :schema="
                    string()
                      .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                      .max(5, '最多5個數字')
                  "
                ></EditableInput>
              </div>
            </div>
          </GroupEditable>
        </div>
        <div class="column is-3">
          <span class="field">承辦警員</span>
          <EditableInput :inputWidth="160" v-model="claimData.policeRept.COP_NAME"></EditableInput>
        </div>
      </div>
    </div>

    <!-- 無記名附約 & 團險資料 -->
    <div class="part multiline-data-area">
      <div class="columns is-multiline">
        <template v-if="hasNoNameList || isLifeGroup">
          <!-- 無記名附約 -->
          <GroupEditable class="is-half" v-if="hasNoNameList" ref="noNameGroup" disableGroupClick>
            <h3>無記名附約</h3>
            <table class="table is-fullwidth apply-table">
              <thead>
                <tr v-if="isLifePerson">
                  <th class="has-text-centered">序號</th>
                  <th>類型</th>
                  <th>保單號碼</th>
                  <th>附約</th>
                  <th>對象</th>
                </tr>
                <tr v-else-if="isLifeGroup">
                  <th class="has-text-centered">序號</th>
                  <th>類型</th>
                  <th>保單號碼</th>
                  <th>對象</th>
                  <th>員工 ID</th>
                  <th>等級</th>
                </tr>
              </thead>
              <tbody v-if="isLifePerson">
                <tr v-for="(noName, index) in noNameList" :key="noName.SER_NO">
                  <td width="45" class="not-editable has-text-centered">{{ index + 1 }}</td>
                  <td width="120">
                    <EditableDropdown
                      v-model="noName.NO_NAME_TYPE"
                      :options="[
                        { name: '壽/意外', value: '1' },
                        { name: '員工福團', value: '2' }
                      ]"
                      :schema="string().required('請選擇類型')"
                    ></EditableDropdown>
                  </td>
                  <td width="145" class="limit-width" style="max-width: 145px">
                    <EditableInput
                      v-model="noName.POLICY_NO"
                      :schema="
                        string()
                          .matches(/^[A-Za-z0-9]*$/, '格式錯誤，請輸入英數字')
                          .max(12, '最多12個字')
                      "
                    ></EditableInput>
                  </td>
                  <td width="100">
                    <EditableInput v-model="noName.PROD_ID" :schema="string().max(4, '最多4個字')"></EditableInput>
                  </td>
                  <td class="is-flex is-align-items-center" style="min-width: 120px">
                    <!-- <span data-editing-type="2" data-delete-button="true">{{ noName.ROLE }}</span> -->
                    <EditableDropdown
                      v-model="noName.ROLE"
                      :editingWidth="111"
                      :options="
                        noName.NO_NAME_TYPE === '1'
                          ? [
                              { name: '子女', value: '0' },
                              { name: '配偶', value: 'C' },
                              { name: '被保人', value: 'I' },
                              { name: '要保人', value: 'A' },
                              { name: '次被保人', value: 'S' },
                              { name: '父母', value: 'P' }
                            ]
                          : [
                              { name: '被保人', value: 'I' },
                              { name: '長子', value: 'B' },
                              { name: '長女', value: 'D' },
                              { name: '二子', value: 'E' },
                              { name: '二女', value: 'F' },
                              { name: '三子', value: 'G' },
                              { name: '三女', value: 'H' },
                              { name: '配偶', value: 'C' },
                              { name: '父親', value: 'J' },
                              { name: '母親', value: 'K' },
                              { name: '其他', value: 'L' }
                            ]
                      "
                      @onSelected="selectSpouseCallback"
                    ></EditableDropdown>
                    <button
                      v-if="noNameGroup?.isGroupEditing"
                      class="button is-primary-lightest ml-2 is-editing"
                      @click="deleteNoNameItem(noName.SER_NO)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else-if="isLifeGroup">
                <tr v-for="(noNameG, index) in noNameGList" :key="noNameG.SER_NO">
                  <td width="50" class="not-editable has-text-centered">{{ index + 1 }}</td>
                  <td width="120">
                    <EditableDropdown
                      v-model="noNameG.NO_NAME_TYPE"
                      :options="[
                        { name: '定期險', value: '3' },
                        { name: '養老險', value: '4' }
                      ]"
                    ></EditableDropdown>
                  </td>
                  <td class="limit-width" style="max-width: 155px">
                    <EditableInput v-model="noNameG.POLICY_NO" :schema="string().max(12, '最多12個字')"></EditableInput>
                  </td>
                  <td>
                    <!-- <span data-editing-type="2" data-delete-button="true">{{ noName.ROLE }}</span> -->
                    <EditableDropdown
                      v-model="noNameG.ROLE"
                      :editingWidth="111"
                      :options="[
                        { name: '被保人', value: 'I' },
                        { name: '長子', value: 'B' },
                        { name: '長女', value: 'D' },
                        { name: '二子', value: 'E' },
                        { name: '二女', value: 'F' },
                        { name: '三子', value: 'G' },
                        { name: '三女', value: 'H' },
                        { name: '配偶', value: 'C' },
                        { name: '父親', value: 'J' },
                        { name: '母親', value: 'K' },
                        { name: '其他', value: 'L' },
                        { name: '員工', value: 'M' }
                      ]"
                      @onSelected="selectSpouseCallback"
                    ></EditableDropdown>
                  </td>
                  <td>
                    <EditableInput
                      v-model="noNameG.EMP_ID"
                      :schema="
                        string()
                          .matches(/^[A-Za-z0-9]*$/, '格式錯誤，請輸入英數字')
                          .max(10, '最多10個字')
                      "
                    ></EditableInput>
                  </td>
                  <td class="is-flex" width="140">
                    <EditableDropdown
                      v-model="noNameG.EMP_DEGREE"
                      :editingWidth="65"
                      dynamic="opened"
                      :options="[
                        {
                          name: '請選擇',
                          value: ''
                        },
                        {
                          name: noNameG.EMP_DEGREE,
                          value: noNameG.EMP_DEGREE,
                          disabled: true
                        }
                      ]"
                      :onRefreshOptions="
                        async () => {
                          return await getEmpDegreeOptions(noNameG.POLICY_NO);
                        }
                      "
                    ></EditableDropdown>
                    <button
                      v-if="noNameGroup?.isGroupEditing"
                      class="button is-primary-lightest ml-2 is-editing"
                      @click="deleteNoNameItem(noNameG.SER_NO)"
                    >
                      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 新增附約 Button -->
            <div class="columns">
              <div class="column is-offset-9">
                <div class="dropdown is-primary">
                  <div class="dropdown-trigger">
                    <button class="button apply-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                      <span>新增附約</span>
                      <img src="/src/assets/images/icon-arrow-down-light.svg" alt="ARROW" />
                    </button>
                  </div>
                  <div class="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a href="#" v-if="isLifePerson" class="dropdown-item" @click.stop.prevent="insertNoNameItem('1')">
                        壽/意外險
                      </a>
                      <a href="#" v-if="isLifePerson" class="dropdown-item" @click.stop.prevent="insertNoNameItem('2')">
                        員工福團
                      </a>
                      <a href="#" v-if="isLifeGroup" class="dropdown-item" @click.stop.prevent="insertNoNameItem('3')">
                        定期險
                      </a>
                      <a href="#" v-if="isLifeGroup" class="dropdown-item" @click.stop.prevent="insertNoNameItem('4')">
                        養老險
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GroupEditable>

          <!-- 團險資料 -->
          <div class="column is-half" v-if="isLifeGroup">
            <h3>團險資料</h3>

            <div
              class="columns is-align-items-center"
              v-if="claimData.COMP_NAME != null || claimData.COMP_DIV != null || claimData.FAC != null"
            >
              <div class="column is-narrow">
                <span class="field">公司名稱</span>
              </div>
              <GroupEditable class="p-0">
                <div class="columns is-align-items-center">
                  <div>
                    <EditableInput
                      placeholder="請輸入公司名稱"
                      :inputWidth="220"
                      :maxWidth="260"
                      v-model="claimData.COMP_NAME"
                      :schema="string().nullable().max(50, '最多50個字')"
                    ></EditableInput>
                  </div>
                  <div>—</div>
                  <div>
                    <EditableInput
                      placeholder="請輸入廠區"
                      :inputWidth="150"
                      :maxWidth="150"
                      v-model="claimData.COMP_DIV"
                      :schema="string().nullable().max(50, '最多50個字')"
                    ></EditableInput>
                  </div>
                  <div>—</div>
                  <div>
                    <EditableInput
                      placeholder="請輸入部門"
                      v-model="claimData.FAC"
                      :maxWidth="150"
                      :schema="string().nullable().max(50, '最多50個字')"
                    ></EditableInput>
                  </div>
                </div>
              </GroupEditable>
            </div>
            <div class="columns has-flex-column" v-if="claimData.EMP_ID != null">
              <!-- <div class="column is-half">
              <span class="field">事故者為員工之</span>
              <EditableDropdown
                v-model="claimData.RLAT_CODE"
                :options="[
                  { name: '本人', value: '0' },
                  { name: '配偶', value: '1' },
                  { name: '子女', value: '2' },
                  { name: '父母', value: '3' },
                  { name: '配偶父母', value: '4' }
                ]"
              ></EditableDropdown>
            </div> -->
              <div class="column is-half">
                <span class="field">員工ID</span>
                <EditableInput
                  v-model="claimData.EMP_ID"
                  :schema="
                    string()
                      .matches(/^[A-Za-z0-9]*$/, '格式錯誤，請輸入英數字')
                      .max(10, '最多10個字')
                  "
                ></EditableInput>
              </div>
            </div>
            <div class="columns has-flex-column">
              <div class="column is-half" v-if="claimData.EMP_NAME != null">
                <span class="field">員工姓名</span>
                <EditableInput :inputWidth="170" v-model="claimData.EMP_NAME"></EditableInput>
              </div>
              <div class="column is-half" v-if="claimData.EMP_BRDY != null">
                <span class="field">員工生日</span>
                <EditableDatePicker v-model="claimData.EMP_BRDY"></EditableDatePicker>
              </div>
            </div>
            <!-- <div class="columns has-flex-column">
            <div class="column is-half">
              <span class="field">團險保單號碼</span>
              <EditableInput :inputWidth="160" v-model="claimData.POLICY_NO"></EditableInput>
            </div>
            <div class="column">
              <span class="field">等級</span>
              <EditableInput v-model="claimData.LEVEL"></EditableInput>
            </div>
          </div> -->
          </div>
        </template>
        <!-- 學團資料 -->
        <div class="column is-half" v-if="isLifeSchool">
          <h3>學團資料</h3>
          <div class="columns" v-if="claimData.SCH_ZIP_CODE != null || claimData.SCH_ADDR != null">
            <div class="column is-narrow ver-center">
              <div>
                <span class="field">地址</span>
              </div>
            </div>
            <GroupEditable class="p-0">
              <div class="columns">
                <div class="column is-narrow mr-5">
                  <EditableInput
                    :inputWidth="80"
                    v-model="claimData.SCH_ZIP_CODE"
                    :schema="
                      string()
                        .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                        .max(7, '最多7個字')
                    "
                  ></EditableInput>
                </div>
                <div class="column is-10 pr-3">
                  <EditableInput v-model="claimData.SCH_ADDR" fitContent></EditableInput>
                </div>
              </div>
            </GroupEditable>
          </div>
          <div class="columns has-flex-column" v-if="claimData.SCH_NO != null">
            <div class="column limit-width">
              <span class="field">學校代碼</span>
              <EditableModal
                v-model:modelText="claimData.SCH_NO"
                v-model:modelValue="claimData.SCH_NAME"
                :modal="{
                  component: InsureSchoolModal,
                  id: 'selectHospitalModal',
                  data: {}
                }"
              ></EditableModal>
            </div>
            <div class="column limit-width">
              <span class="field">投保學校</span>
              <EditableInput v-model="claimData.SCH_NAME" :schema="string().max(25, '名稱過長，限制25字以內')"></EditableInput>
            </div>
          </div>
          <div class="columns has-flex-column" v-if="claimData.SCH_TEL_NO != null">
            <div class="column">
              <span class="field">電話</span>
              <EditableInput v-model="claimData.SCH_TEL_NO" :schema="string().max(20, '最多20個字')"></EditableInput>
            </div>
          </div>
          <div class="column is-half" v-if="claimData.IS_APPLY != null">
            <span class="field">申請專案補助</span>
            <EditableCheckbox checkedFlag="1" uncheckedFlag="0" v-model="claimData.IS_APPLY"></EditableCheckbox>
          </div>
          <div class="columns has-flex-column" v-if="claimData.POLICY_NO != null">
            <div class="column">
              <span class="field">保單號碼</span>
              <EditableInput
                v-model="claimData.POLICY_NO"
                :schema="string().required('請輸入保單號碼').max(10, '最多10個字')"
              ></EditableInput>
            </div>
          </div>
        </div>

        <!-- 聯絡資訊 -->
        <div class="column is-half hidden-parts">
          <h3>{{ isLifeGroup ? '員工' : '事故人' }}聯絡資訊</h3>
          <div class="columns" v-if="basicData.OCR_ZIP_CODE != null || basicData.OCR_ADDR != null">
            <div class="column is-narrow ver-center">
              <div class="w-116">
                <span class="field">居住地址</span>
              </div>
            </div>
            <GroupEditable class="p-0" disableGroupClick>
              <div class="columns">
                <div class="column" style="max-width: 100px">
                  <span class="data not-editable font-eudc">{{ basicData.OCR_ZIP_CODE }}</span>
                </div>
                <div class="column is-10">
                  <span class="data not-editable font-eudc">{{ basicData.OCR_ADDR }}</span>
                </div>
              </div>
            </GroupEditable>
          </div>
          <div class="columns" v-if="isLifePerson && (basicData.DAY_ZIP_CODE != null || basicData.DAY_ADDR != null)">
            <div class="column is-narrow ver-center">
              <div class="w-116">
                <span class="field">白天易晤地址</span>
              </div>
            </div>
            <GroupEditable class="p-0" disableGroupClick>
              <div class="columns">
                <div class="column" style="max-width: 100px">
                  <span class="data not-editable font-eudc">{{ basicData.DAY_ZIP_CODE }}</span>
                </div>
                <div class="column is-10">
                  <span class="data not-editable font-eudc">{{ basicData.DAY_ADDR }}</span>
                </div>
              </div>
            </GroupEditable>
          </div>
          <div class="columns has-flex-column">
            <GroupEditable
              class="is-half p-0"
              disableGroupClick
              v-if="basicData.IS_OIU !== 'Y' && (basicData.OCR_TEL_AREA != null || basicData.OCR_TEL != null)"
            >
              <div class="columns">
                <div class="column is-narrow">
                  <span class="field">聯絡電話</span>
                </div>
                <div class="columns is-align-items-center is-gapless" style="min-width: 240px">
                  <div class="column is-narrow" style="padding-right: 0 !important">
                    <span class="data not-editable font-eudc">{{ basicData.OCR_TEL_COUNTRY }}</span>
                    <span class="data not-editable font-eudc">{{ basicData.OCR_TEL_AREA }}</span>
                  </div>
                  <div class="column is-narrow">-</div>
                  <div class="column is-narrow" style="padding-right: 0 !important">
                    <span class="data not-editable font-eudc">{{ basicData.OCR_TEL }}</span>
                  </div>
                  <div class="column is-narrow">#</div>
                  <div class="column is-3">
                    <span class="data not-editable font-eudc">{{ basicData.OCR_TEL_EXT }}</span>
                  </div>
                </div>
              </div>
            </GroupEditable>
            <div
              class="is-half p-0"
              v-if="basicData.IS_OIU === 'Y' && (basicData.OCR_TEL_AREA != null || basicData.OCR_TEL != null)"
            >
              <div class="columns">
                <div class="column is-narrow">
                  <span class="field">聯絡電話</span>
                </div>
                <GroupEditable class="p-0">
                  <div class="columns is-align-items-center is-gapless" style="min-width: 400px">
                    <div class="column is-narrow" style="max-width: 70px; margin-right: 20px">
                      <EditableInput
                        v-model="basicData.OCR_TEL_COUNTRY"
                        :placeholder="'國際碼'"
                        :inputWidth="70"
                        :schema="
                          string()
                            .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                            .max(5, '長度最長為5')
                        "
                      ></EditableInput>
                    </div>
                    <div class="column is-narrow" style="max-width: 70px">
                      <EditableInput
                        v-model="basicData.OCR_TEL_AREA"
                        :inputWidth="70"
                        :schema="
                          string()
                            .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                            .max(3, '長度最長為3')
                        "
                      ></EditableInput>
                    </div>
                    <div class="column is-narrow" style="margin: 0px 5px 0px 5px">-</div>
                    <div class="column is-narrow" style="padding-right: 10 !important; max-width: 120px">
                      <EditableInput
                        v-model="basicData.OCR_TEL"
                        :inputWidth="120"
                        :schema="
                          string()
                            .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                            .max(10, '長度最長為10')
                        "
                      ></EditableInput>
                    </div>
                    <div class="column is-narrow" style="margin: 0px 5px 0px 5px">#</div>
                    <div class="column is-narrow" style="padding-right: 10 !important; max-width: 70px">
                      <EditableInput
                        v-model="basicData.OCR_TEL_EXT"
                        :inputWidth="70"
                        :schema="
                          string()
                            .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                            .max(5, '長度最長為5')
                        "
                      ></EditableInput>
                    </div>
                  </div>
                </GroupEditable>
              </div>
            </div>
          </div>
          <div class="columns has-flex-column">
            <div class="column is-half" v-if="basicData.OCR_MOBIL_TEL != null && basicData.IS_OIU !== 'Y'">
              <span class="field">行動電話</span>
              <span class="data not-editable font-eudc">{{ basicData.OCR_MOBIL_COUNTRY }}</span>
              <span class="data not-editable font-eudc">{{ basicData.OCR_MOBIL_TEL }}</span>
            </div>
            <div class="column is-half" v-if="basicData.OCR_MOBIL_TEL != null && basicData.IS_OIU === 'Y'">
              <span class="field">行動電話</span>
              <GroupEditable class="p-0">
                <div class="column is-narrow" style="padding-right: 0 !important; max-width: 70px; margin-right: 20px">
                  <EditableInput
                    v-model="basicData.OCR_MOBIL_COUNTRY"
                    :placeholder="'國際碼'"
                    :inputWidth="70"
                    :schema="
                      string()
                        .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                        .max(5, '長度最長為5')
                    "
                  ></EditableInput>
                </div>
                <div class="column is-narrow" style="padding-right: 0 !important; max-width: 120px">
                  <EditableInput
                    v-model="basicData.OCR_MOBIL_TEL"
                    :inputWidth="120"
                    :schema="
                      string()
                        .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                        .max(10, '長度最長為10')
                    "
                  ></EditableInput>
                </div>
              </GroupEditable>
            </div>
          </div>
          <div class="columns has-flex-column" v-if="basicData.OCR_EMAIL != null">
            <div class="column">
              <span class="field">Email</span>
              <span class="data not-editable font-eudc">{{ basicData.OCR_EMAIL }}</span>
            </div>
          </div>
        </div>
        <!-- 送件人/理專資訊 -->
        <div class="column is-half hidden-parts">
          <h3>送件人/理專資訊</h3>

          <div class="columns has-flex-column">
            <div class="column is-3" v-if="isLifePerson && claimData.TRN_IS_SPC_AGNT != null">
              <span class="field mr-12">送件人為理專</span>
              <span class="data not-editable">
                <img v-if="claimData.TRN_IS_SPC_AGNT === 'Y'" src="/src/assets/images/icon-checkmark-check.svg" alt="CHECKMARK" />
                <template v-else>否</template>
              </span>
            </div>
            <div class="column is-4" v-if="claimData.SPC_AGNT_NAME != null || claimData.TRN_NAME != null">
              <span class="field mr-12">姓名</span>
              <EditableInput
                v-if="claimData.TRN_IS_SPC_AGNT === 'Y'"
                v-model="claimData.SPC_AGNT_NAME"
                :schema="string().nullable().required('請輸入姓名')"
              ></EditableInput>
              <EditableInput
                v-else
                v-model="claimData.TRN_NAME"
                :schema="string().nullable().required('請輸入姓名')"
              ></EditableInput>
            </div>
            <div class="column is-5" v-if="claimData.SPC_AGNT_ID != null || claimData.TRN_ID != null">
              <span class="field mr-12">ID/登錄字號</span>
              <EditableInput
                v-if="claimData.TRN_IS_SPC_AGNT === 'Y'"
                v-model="claimData.SPC_AGNT_ID"
                :schema="
                  string()
                    .required('請輸入登入字號')
                    .matches(/^[A-Za-z0-9]*$/, '格式錯誤，請輸入英數字')
                    .max(10, '最多10個字')
                "
              ></EditableInput>
              <EditableInput
                v-else
                v-model="claimData.TRN_ID"
                :schema="
                  string()
                    .required('請輸入ID')
                    .matches(/^[A-Za-z0-9]*$/, '格式錯誤，請輸入英數字')
                    .max(10, '最多10個字')
                "
              ></EditableInput>
            </div>
          </div>
          <div
            class="columns has-flex-column"
            v-if="
              claimData.SPC_AGNT_DIV_NO != null ||
              claimData.SPC_AGNT_DIV_NAME != null ||
              claimData.TRN_DIV_NO != null ||
              claimData.TRN_DIV_NAME != null
            "
          >
            <div class="column">
              <span class="field">單位/分行名稱</span>
              <span class="data not-editable font-eudc">
                <template v-if="claimData.TRN_IS_SPC_AGNT === 'Y'">
                  {{ claimData.SPC_AGNT_DIV_NO }} {{ claimData.SPC_AGNT_DIV_NAME }}
                </template>
                <template v-else> {{ claimData.TRN_DIV_NO }} {{ claimData.TRN_DIV_NAME }} </template>
              </span>
            </div>
          </div>
          <div
            class="columns has-flex-column"
            v-if="isLifePerson && (claimData.SPC_EMAIL != null || claimData.TRN_EMAIL != null)"
          >
            <div class="column">
              <span class="field">電子郵件</span>
              <EditableInput
                v-if="claimData.TRN_IS_SPC_AGNT === 'Y'"
                v-model="claimData.SPC_EMAIL"
                :schema="string().nullable().email('Email格式錯誤').max(50, '最多50字')"
              ></EditableInput>
              <EditableInput
                v-else
                v-model="claimData.TRN_EMAIL"
                :schema="string().nullable().email('Email格式錯誤').max(50, '最多50字')"
              ></EditableInput>
            </div>
          </div>
          <div class="columns has-flex-column">
            <div class="column p-0">
              <!-- 理專 -->
              <div class="column" v-if="claimData.TRN_IS_SPC_AGNT === 'Y' && claimData.SPC_TEL_NO != null">
                <span class="field">電話</span>
                <EditableInput v-model="claimData.SPC_TEL_NO"></EditableInput>
              </div>
              <!-- 寄件人電話 -->
              <template v-else>
                <!-- 團險 寄件人電話 -->
                <template v-if="isLifeGroup">
                  <GroupEditable
                    class="is-half p-0 w-100"
                    v-if="claimData.TRN_TEL_AREA != null || claimData.TRN_TEL != null || claimData.TRN_TEL_EXT != null"
                  >
                    <div class="columns w-100">
                      <div class="column is-narrow p-0">
                        <span class="field">聯絡電話</span>
                      </div>
                      <div class="column is-align-items-center is-gapless p-0">
                        <div class="column is-narrow" style="padding-right: 0 !important; max-width: 50px">
                          <EditableInput
                            v-model="claimData.TRN_TEL_AREA"
                            :inputStyle="{
                              padding: '8px 0 8px 5px',
                              width: '43px'
                            }"
                            :schema="
                              string()
                                .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                                .max(4, '最多4個數字')
                            "
                          ></EditableInput>
                        </div>
                        <div class="column is-narrow">-</div>
                        <div class="column is-narrow" style="padding-right: 0 !important">
                          <EditableInput
                            v-model="claimData.TRN_TEL"
                            :inputStyle="{ width: '88px', padding: '8px 0 8px 4px' }"
                            :schema="
                              string()
                                .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                                .max(8, '最多8個數字')
                            "
                          ></EditableInput>
                        </div>
                        <div class="column is-narrow">#</div>
                        <div class="column is-3">
                          <EditableInput
                            v-model="claimData.TRN_TEL_EXT"
                            :inputStyle="{
                              width: '57px',
                              padding: '8px 0 8px 4px'
                            }"
                            :schema="
                              string()
                                .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                                .max(5, '最多5個數字')
                            "
                          ></EditableInput>
                        </div>
                      </div>
                    </div>
                  </GroupEditable>
                  <div class="column is-half" v-if="claimData.TRN_MOBIL_TEL != null">
                    <span class="field">行動電話</span>
                    <EditableInput
                      v-model="claimData.TRN_MOBIL_TEL"
                      :inputWidth="190"
                      :schema="
                        string()
                          .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                          .max(20, '最多20個字')
                      "
                    ></EditableInput>
                  </div>
                </template>
                <!--個、學團險 寄件人電話 -->
                <template v-else-if="claimData.TEL_NO_1 != null || claimData.TEL_NO_2 != null || claimData.TEL_NO_3 != null">
                  <span class="field">電話</span>
                  <GroupEditable class="p-0">
                    <EditableInput
                      class="m-2"
                      v-model="claimData.TEL_NO_1"
                      :inputWidth="120"
                      :schema="
                        string()
                          .required('請輸入電話')
                          .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                          .max(20, '最多20個字')
                      "
                    ></EditableInput>
                    <EditableInput
                      class="m-2"
                      v-model="claimData.TEL_NO_2"
                      :inputWidth="120"
                      :schema="
                        string()
                          .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                          .max(20, '最多20個字')
                      "
                    ></EditableInput>
                    <EditableInput
                      class="m-2"
                      v-model="claimData.TEL_NO_3"
                      :inputWidth="120"
                      :schema="
                        string()
                          .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                          .max(20, '最多20個字')
                      "
                    ></EditableInput>
                  </GroupEditable>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- 其他 -->
        <div class="column is-half hidden-parts">
          <h3>其他</h3>
          <div class="columns">
            <div class="column is-half" v-if="claimData.APLY_EMP_ID != null || claimData.APLY_NAME != null">
              <span class="field">受理人員</span>
              <span class="data not-editable font-eudc">{{ claimData.APLY_EMP_ID }} {{ claimData.APLY_NAME }}</span>
            </div>
            <div class="column is-half" v-if="claimData.APLY_DATE_01 != null">
              <span class="field">受理日期</span>
              <span class="data not-editable">{{ getROCDate(claimData.APLY_DATE_01) }}</span>
            </div>
          </div>
          <div class="columns" v-if="claimData.APLY_DIV_NO != null || claimData.APLY_DIV_NAME != null">
            <div class="column">
              <span class="field">受理單位</span>
              <span class="data not-editable font-eudc">{{ claimData.APLY_DIV_NO }} {{ claimData.APLY_DIV_NAME }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增按鈕 -->
    <div class="part" :class="{ 'border-none': !hasNoNameList || !claimData.policeRept }">
      <div class="columns">
        <div class="column">
          <button class="button apply-btn mr-4" @click="addNoNameArea" v-if="!hasNoNameList && !isLifeSchool">
            <span>新增無記名資料</span>
            <img src="/src/assets/images/icon-add.svg" alt="ADD" />
          </button>
          <button class="button apply-btn" @click="addPoliceArea" v-if="!claimData.policeRept && !isLifeSchool">
            <span>新增檢警資料</span>
            <img src="/src/assets/images/icon-add.svg" alt="ADD" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
  import EditableDatePicker from '~/components/Editable/EditableDatePicker.vue';
  import EditableInput from '~/components/Editable/EditableInput.vue';
  import GroupEditable from '~/components/Editable/GroupEditable.vue';
  import EditableCheckbox from '~/components/Editable/EditableCheckbox.vue';
  import useMoment from '~/composables/useMoment';
  import ClaimCategoryModal from './Modals/ClaimCategoryModal.vue';
  import AccidentReasonModal from './Modals/AccidentReasonModal.vue';
  import InsureSchoolModal from './Modals/InsureSchoolModal.vue';
  import EditableModal from '~/components/Editable/EditableModal.vue';
  import { isEmpty, remove } from 'lodash-es';
  import { useApplyStore } from '~/stores/apply';
  import { storeToRefs } from 'pinia';
  import { number, string } from 'yup';
  import useSwal from '~/composables/useSwal';

  const applyStore = useApplyStore();
  const { isLifePerson, isLifeGroup, isLifeSchool, basicData } = storeToRefs(applyStore);
  const { $swal } = useSwal();

  const props = defineProps({
    claimData: {
      type: Object,
      required: true,
      default: {}
    }
  });
  const { getROCDate, isSameOrAfter } = useMoment();
  const claimData = toRef(props, 'claimData');
  // 保險類別文字
  const handleProdCat = (codes) => {
    let prodCat = [];
    if (codes) {
      codes.split('_').forEach((element) => {
        switch (element) {
          case '1':
            prodCat.push('個人險');
            break;
          case '2':
            prodCat.push('團體險');
            break;
          case '3':
            prodCat.push('學生團體險');
            break;
          default:
            break;
        }
      });
    }
    return prodCat.join(',');
  };

  const noNameGroup = ref(null);

  // 事故原因文字
  const ocrReason = computed(() => claimData.value.OCR_RESN + claimData.value.OCR_RESN_NAME);

  // 索賠類別文字
  const claimCatText = computed(() => {
    if (!claimData.value.CFM_CLAM_CAT_NAME) return '';
    return claimData.value.CFM_CLAM_CAT_NAME.split('_').join(',');
  });

  // 新增無記名附約資料
  const insertNoNameItem = (noNameType) => {
    if (isLifePerson.value) {
      const serNo = Math.max(...claimData.value.noNameList.map((n) => n.SER_NO).concat(0)) + 1;
      claimData.value.noNameList.push({
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo8',
        SER_NO: serNo.toString(),
        NO_NAME_TYPE: noNameType,
        POLICY_NO: '',
        PROD_ID: '',
        ROLE: '',
        ACT_CD: 'A'
      });
    } else {
      const serNo = Math.max(...claimData.value.noNameGList.map((n) => n.SER_NO).concat(0)) + 1;
      claimData.value.noNameGList.push({
        javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo9',
        SER_NO: serNo.toString(),
        NO_NAME_TYPE: noNameType,
        POLICY_NO: '',
        ROLE: '',
        EMP_ID: '',
        EMP_DEGREE: '',
        ACT_CD: 'A'
      });
    }
    noNameGroup.value?.refreshGroup();
  };

  // 只顯示不是D的(未刪除的)
  const noNameList = computed(() => claimData.value.noNameList.filter((e) => e.ACT_CD !== 'D'));
  const noNameGList = computed(() => claimData.value.noNameGList.filter((e) => e.ACT_CD !== 'D'));

  // 刪除無記名資料
  const deleteNoNameItem = (serNo) => {
    // if (isLifePerson.value) remove(claimData.value.noNameList, (e) => e.SER_NO === serNo);
    // else if (isLifeGroup.value) remove(claimData.value.noNameGList, (e) => e.SER_NO === serNo);

    if (isLifePerson.value) {
      let noName = claimData.value.noNameList.find((e) => e.SER_NO === serNo);
      if (noName) noName.ACT_CD = 'D';
    } else {
      let noNameG = claimData.value.noNameGList.find((e) => e.SER_NO === serNo);
      if (noNameG) noNameG.ACT_CD = 'D';
    }
  };

  // 是否有無記名資料區塊: 非學團險並且有資料
  const hasNoNameList = computed(() => {
    return !isLifeSchool.value && (claimData.value.noNameList || claimData.value.noNameGList);
  });

  // 新增無記名資料區塊
  const addNoNameArea = () => {
    claimData.value.noNameList = [];
    claimData.value.noNameGList = [];
  };

  // 新增檢警資料
  const addPoliceArea = () => {
    claimData.value.policeRept = {
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo19',
      OCR_STORY: '',
      OCR_PLCE_ADDR: '',
      REPT_DATE: '',
      REPT_COP_DEPT: '',
      REPT_COP_AREA: '',
      REPT_COP_TEL: '',
      REPT_COP_EXT: '',
      COP_NAME: ''
    };
  };

  const afterOcrDateSchema = string()
    .nullable()
    .test(
      'after-ocrDate',
      '該日期不可早於事故日',
      (value) => isEmpty(value) || isEmpty(applyStore.claimData.OCR_DATE) || isSameOrAfter(value, applyStore.claimData.OCR_DATE)
    );

  // 取得員工等級下拉選單
  const getEmpDegreeOptions = async (policyNo) => {
    try {
      let options = [{ name: '請選擇', value: '', selected: true }];
      if (!policyNo) {
        return options;
        // throw 'EMPTY OP PROD';
      }
      let degrees = await applyStore.GetEmpDegreeSel(policyNo);

      degrees.forEach((e) => {
        options.push({
          name: e.EMP_DEGREE,
          value: e.EMP_DEGREE
        });
      });
      return options;
    } catch (e) {
      console.error(e);
      $swal.fail(e);
      return [{ name: '請選擇', value: '' }];
    }
  };

  // 無記名附約對象若選擇配偶，需跳訊息彈窗
  const selectSpouseCallback = (value) => {
    if (value === 'C') {
      $swal.info('請確認無記名保單婚姻關係是否存在');
    }
  };
</script>
