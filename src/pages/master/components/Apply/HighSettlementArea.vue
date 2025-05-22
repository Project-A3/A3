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

      </div>
      <template v-if="highSettlementData?.DEATH_DATA">
        <!-- Quyền lợi tử vong -->
        <!-- 死亡給付 -->
        <h3><cathay-translate code="Component_HighSettlementArea_015"/></h3>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field"><cathay-translate code="Component_HighSettlementArea_016"/></span>
                <DatetimePicker 
                    v-model="basicData.DEATH_DATE"
                    style="width: 180px"
                ></DatetimePicker>
            </div>
            
            <div class="column">
                <span class="field"><cathay-translate code="Component_HighSettlementArea_017"/></span>
                <DatetimePicker 
                    v-model="basicData.DEATH_CERTIFICATE_ISSUE_DATE"
                    style="width: 180px"
                ></DatetimePicker>
            </div>
        </div>
                <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field"><cathay-translate code="Component_HighSettlementArea_018"/></span>
                    <FormInput 
                    v-model="basicData.DEATH_REASON"
                    type="text" 
                    class="w-330" 
                    ></FormInput>
            </div>
            
            <div class="column">
                <span class="field"><cathay-translate code="Component_HighSettlementArea_021"/></span>
                    <FormInput 
                    v-model="basicData.DEATH_CERTIFICATE_NUM"
                    type="text" 
                    class="w-330" 
                    ></FormInput>
            </div>
        </div>
                <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field"><cathay-translate code="Component_HighSettlementArea_022"/></span>
                    <BaseDropdown 
                      v-model="basicData.DEATH_PLACE"
                      :options="[
                        { name: language.translate('Component_HighSettlementArea_073') , value: '0' },
                        { name: language.translate('Component_HighSettlementArea_106'), value: '1' },
                        { name: language.translate('Component_HighSettlementArea_107'), value: '2' },
                        { name: language.translate('Component_HighSettlementArea_108'), value: '3' }
                      ]"
                    ></BaseDropdown>
            </div>
            
            <div class="column">
                <span class="field"><cathay-translate code="Component_HighSettlementArea_023"/></span>
                    <FormInput 
                    v-model="basicData.DEATH_REGISTRATION_UNIT"
                    type="text" 
                    class="w-330" 
                    ></FormInput>
            </div>
        </div>
      </template>
    </div>

    <div class="hidden-parts">
      <!-- 完全失能項目 -->
      <div class="part" v-if="basicData.APPLY_H_DISB_IND === 'Y'">
        <h3><cathay-translate code="Component_HighSettlementArea_030"/></h3>

        <div class="columns has-flex-column">
          <div class="column is-3">
            <span class="field mr-12"><cathay-translate code="Component_HighSettlementArea_031"/></span>
            <EditableDropdown v-model:modelValue="basicData.DISB_CAT" :editingWidth="130"
              :schema="deathDateRequiredSchema" :options="[
                { name: language.translate('Component_HighSettlementArea_073'), value: '1' },
                { name: language.translate('Component_HighSettlementArea_074'), value: '2' },
                { name: language.translate('Component_HighSettlementArea_075'), value: '3' }
              ]"></EditableDropdown>
          </div>
          <div class="column is-8">
            <!-- Hạng mục thương tật toàn bộ và vĩnh viễn -->
            <span class="field"><cathay-translate code="Component_HighSettlementArea_030"/></span>
            <EditableDropdown
                      v-model="basicData.DISB_ITEM"
                      :editingWidth="500"
                      :schema="deathDateRequiredSchema"
                      :isEditable="true"
                      :options="[
                        { name: language.translate('Component_HighSettlementArea_073'), value: '8' },
                        { name: language.translate('Component_HighSettlementArea_076'), value: '0' },
                        { name: language.translate('Component_HighSettlementArea_077'), value: '1' },
                        { name: language.translate('Component_HighSettlementArea_078'), value: '2' },
                        { name: language.translate('Component_HighSettlementArea_079'), value: '3' },
                        { name: language.translate('Component_HighSettlementArea_080'), value: '4' },
                        { name: language.translate('Component_HighSettlementArea_081'), value: '5' },
                        { name: language.translate('Component_HighSettlementArea_082'), value: '6' },
                        { name: language.translate('Component_HighSettlementArea_083'), value: '7' }
                      ]"
             ></EditableDropdown>
          </div>
        </div>
      </div>

      <!-- 失能給付 -->
      <div class="part" v-if="highSettlementData?.DISB_DATA">
        <!-- Cấp độ thương tật từng phần -->
        <h3><cathay-translate code="Component_HighSettlementArea_033"/></h3>
                <BaseDropdown 
                      v-model="firstDiag.APPLY_DISB_GRADE_1"
                      :options="[
                        { name: language.translate('Component_HighSettlementArea_073'), value: '0' },
                        { name: language.translate('Component_HighSettlementArea_099'), value: '1' },
                        { name: language.translate('Component_HighSettlementArea_100'), value: '2' },
                        { name: language.translate('Component_HighSettlementArea_101'), value: '3' },
                        { name: language.translate('Component_HighSettlementArea_102'), value: '4' },
                        { name: language.translate('Component_HighSettlementArea_103'), value: '5' },
                        { name: language.translate('Component_HighSettlementArea_104'), value: '6' }
                      ]"
                ></BaseDropdown>

        <div class="columns">
          <GroupEditable class="is-full" ref="disbGroup" disableGroupClick>
            <table class="table is-fullwidth apply-table">

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
                          name: 'Vui lòng chọn',
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
                          name: 'Vui lòng chọn',
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
                          name: 'Vui lòng chọn',
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
                          name: 'Vui lòng chọn',
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
                          name: 'Vui lòng chọn',
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
      </div>

      <!-- 重大疾病或特定傷病給付 -->
      <div class="part" v-if="highSettlementData?.HEVY_DIS_DATA">
        <!-- Trợ cấp cho bệnh tật nghiêm trọng hoặc bệnh thương tật cụ thể -->
        <h3><cathay-translate code="Component_HighSettlementArea_036"/></h3>
          <span class="field mr-3"><cathay-translate code="Component_HighSettlementArea_094"/></span>
          <EditableCheckbox v-model="basicData.MAJOR_DIS_1"></EditableCheckbox>
          <span class="field ml-6 mr-3"><cathay-translate code="Component_HighSettlementArea_095"/></span>
          <EditableCheckbox v-model="basicData.MAJOR_DIS_2"></EditableCheckbox>
          <span class="field ml-6 mr-3"><cathay-translate code="Component_HighSettlementArea_096"/></span>
          <EditableCheckbox v-model="basicData.MAJOR_DIS_4"></EditableCheckbox>
          <span class="field ml-6 mr-3"><cathay-translate code="Component_HighSettlementArea_097"/></span>
          <EditableCheckbox v-model="basicData.MAJOR_DIS_5"></EditableCheckbox>
          <span class="field ml-6 mr-3"><cathay-translate code="Component_HighSettlementArea_098"/></span>
          <EditableCheckbox v-model="basicData.MAJOR_DIS_3"></EditableCheckbox>
      </div>
      <!-- 長期看護 -->
      <div class="part" v-if="highSettlementData?.LONG_DATA">
        <h3><cathay-translate code="Component_HighSettlementArea_040"/></h3>
        <div class="columns has-flex-column">
          <div class="column is-half">
            <div class="field mr-3"><cathay-translate code="Component_HighSettlementArea_040"/></div>
            <EditableCheckbox v-model="firstDiag.APPLY_LONG_CARE"></EditableCheckbox>
          </div>
        </div>
      </div>
      <!-- LIFEEND_DATA -->
      <div class="part" v-if="highSettlementData?.LIFEEND_DATA">
        <h3><cathay-translate code="Component_HighSettlementArea_050"/></h3>
        <div class="columns has-flex-column">
          <div class="column is-half">
            <div class="field mr-3"><cathay-translate code="Component_HighSettlementArea_050"/></div>
            <EditableCheckbox v-model="firstDiag.APPLY_END_LIFE"></EditableCheckbox>
          </div>
        </div>
      </div>
      <!-- CANCER_DATA -->
      <div class="part" v-if="highSettlementData?.CANCER_DATA">
        <h3><cathay-translate code="Component_HighSettlementArea_050"/></h3>
        <div class="columns has-flex-column">
          <div class="column is-half">
            <div class="field mr-3"><cathay-translate code="Component_HighSettlementArea_105"/></div>
                <DatetimePicker 
                    v-model="firstDiag.APPLY_CANCER_DATE"
                    style="width: 180px"
                ></DatetimePicker>
            </div>
        </div>
      </div>
    </div>
    <!-- 豁免表示 -->
    <div class="part" v-if="highSettlementData?.WAIVER_DATA">
      <h3><cathay-translate code="Component_HighSettlementArea_042"/></h3>
      <div class="columns">
        <div class="column">
          <!-- Miễn nộp phí bảo hiểm -->
          <span class="field mr-12"><cathay-translate code="Component_HighSettlementArea_042"/></span>
          <EditableCheckbox v-model="firstDiag.APPLY_DISABLE"></EditableCheckbox>
        </div>
      </div>
    </div>

    <div class="hidden-parts">
      <!-- 燒燙傷表示 -->
      <div class="part" v-if="highSettlementData.BURN_DATA">
        <h3><cathay-translate code="Component_HighSettlementArea_047"/></h3>

        <div class="columns has-flex-column">
          <div class="column is-half">
            <!-- Mức độ thương tật do bỏng -->
            <span class="field mr-12"><cathay-translate code="Component_HighSettlementArea_048"/></span>
                <BaseDropdown 
                      v-model="firstDiag.APPLY_BURNED_IND"
                      :options="[
                        { name: language.translate('Component_HighSettlementArea_073') , value: '0' },
                        { name: language.translate('Component_HighSettlementArea_092'), value: '1' },
                        { name: language.translate('Component_HighSettlementArea_093'), value: '2' }
                      ]"
                ></BaseDropdown>
            <!-- <span class="data" data-editing-type="2" data-fit-content="true" data-editing-mp="pr-4">資料資料資料</span> -->
          </div>

        </div>
      </div>

      <!-- 定期給付保險金 -->
      <div class="part" v-if="highSettlementData.PERIOD_DATA">
        <h3><cathay-translate code="Component_HighSettlementArea_049"/></h3>

        <div class="columns has-flex-column">
          <div class="column is-half">
            <!-- Tiền bảo hiểm chi trả định kỳ -->
            <span class="field"><cathay-translate code="Component_HighSettlementArea_049"/></span>
            <EditableDropdown
              :fitContent="true"
              :editingWidth="180"
              v-model="highSettlementData.PERIOD_DATA.CFM_IS_ANTY"
              :options="[
                { name: language.translate('Component_HighSettlementArea_073'), value: '0' },
                { name: language.translate('Component_HighSettlementArea_090'), value: '1' },
                { name: language.translate('Component_HighSettlementArea_091'), value: '2' }
              ]"
            ></EditableDropdown>
          </div>
        </div>
      </div>

      <!-- 其他 -->
      <div class="columns part">
        <!-- 婦女津貼 -->
        <div class="column is-6" v-if="highSettlementData.FEMALE_DATA">
          <div class="part border-none">
            <h3><cathay-translate code="Component_HighSettlementArea_051"/></h3>
            <div class="columns is-multiline has-flex-column">
              <div class="field mr-12"><cathay-translate code="Component_HighSettlementArea_109"/></div>
                <BaseDropdown 
                      v-model="firstDiag.APPLY_OBSTETRICAL"
                      :options="[
                        { name: language.translate('Component_HighSettlementArea_073'), value: '0' },
                        { name: language.translate('Component_HighSettlementArea_084'), value: '1' },
                        { name: language.translate('Component_HighSettlementArea_085'), value: '2' },
                        { name: language.translate('Component_HighSettlementArea_086'), value: '3' },
                        { name: language.translate('Component_HighSettlementArea_086'), value: '4' },
                        { name: language.translate('Component_HighSettlementArea_087'), value: '5' },
                        { name: language.translate('Component_HighSettlementArea_088'), value: '6' }
                      ]"
                ></BaseDropdown>
            </div>
          </div>
        </div>

        <!-- 特殊 -->
        <div class="column is-3" v-if="highSettlementData.SPECIAL_DATA">
          <div class="part border-none">
            <h3><cathay-translate code="Component_HighSettlementArea_057"/></h3>
            <div class="columns is-multiline has-flex-column">
              <div class="column is-full">
                <span class="field mr-12"><cathay-translate code="Component_HighSettlementArea_058"/></span>
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
                <span class="field mr-12"><cathay-translate code="Component_HighSettlementArea_059"/></span>
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
                <span class="field mr-12"><cathay-translate code="Component_HighSettlementArea_060"/></span>
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
            v-if="basicData.APPLY_H_DISB_IND === 'N'"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('APPLY_H_DISB_IND')"
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
          <!-- <button
            v-if="!highSettlementData.PERIOD_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('PERIOD_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_010"/>
          </button> -->
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
          <!-- <button
            v-if="!highSettlementData.SPECIAL_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('SPECIAL_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_013"/>
          </button> -->
          <button
            v-if="!highSettlementData.CANCER_DATA"
            class="button is-primary has-icon-back has-icon-back-add"
            @click="addArea('CANCER_DATA')"
          >
          <cathay-translate code="Component_HighSettlementArea_014"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
  import GroupEditable from '~/components/Editable/GroupEditable.vue';
  import EditableCheckbox from '~/components/Editable/EditableCheckbox.vue';
  import EditableModal from '~/components/Editable/EditableModal.vue';
  import GestationModal from './Modals/GestationModal.vue';
  import CordBloodDiseaseModal from './Modals/CordBloodDiseaseModal.vue';
  import CongenitalDisabilityModal from './Modals/CongenitalDisabilityModal.vue';
  import FormInput from '~/components/Form/FormInput.vue';
  import DatetimePicker from '~/components/DatetimePicker.vue';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import { useApplyStore } from '~/stores/apply';
  import { sequence } from '../../../../common/utils';
  import {isEmpty } from 'lodash-es';
  import { string } from 'yup';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { storeToRefs } from 'pinia';
  import { useLanguageStore } from "~/stores/language";
  const  language=useLanguageStore();
  const { $swal } = useSwal();
  const { isSameOrAfter } = useMoment();
  const applyStore = useApplyStore();
  const { isShowInKindPayArea, basicData, basicDiag} = storeToRefs(applyStore);

  const firstDiag = ref(basicDiag.value);
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
      CFM_DISB_NO_NAME: '',
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
      case 'CANCER_DATA':
        template = {
          CFM_CANCER_LVL: '0',
          CFM_CANCER_GRAD: ''
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
      case 'APPLY_H_DISB_IND':
        template = {
          DISB_CAT: '1',
          DISB_ITEM: '0'
        };
        basicData.value.APPLY_H_DISB_IND = 'Y';
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
      let options = [{ name: 'Vui lòng chọn', value: '', selected: true }];
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
      return [{ name: 'Vui lòng chọn', value: '' }];
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
