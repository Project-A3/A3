<template>
  <div class='page-beneficiary'>
    <main>
      <section id="mainSection" style="width: 100%">
        <h2 style="font-size: 24px;color: #272734;font-weight: 600;text-align: center;margin-bottom: 18px;">
        保單受益人清單
        </h2>
        <div>
          <div class="card is-full">
            <div class="table-content">
              <div class="table-title">
                <span style="font-weight: 600">保單號碼：{{policyNo}}</span>
              </div>
            </div>
          </div>

          <div class="first-card">
            <span class="sticky-basic-info"></span>
            <!-- Data List -->
            <div class="card is-full">
              <div class="table-content">
                <div class="table-title">
                  <span style="font-weight: 600">主檔受益人</span>
                </div>
                <table class="table is-striped-odd hover-none is-fullwidth" v-if="!isEmpty(beneList)">
                  <thead>
                    <tr>
                      <th class="has-text-centered">序號</th>
                      <th class="has-text-centered">受益人類別</th>
                      <th class="has-text-centered">證件號碼<br>受益人姓名</th>
                      <th class="has-text-centered">國籍<br>關係</th>
                      <th class="has-text-centered">出生日期<br>依民法</th>
                      <th class="has-text-centered">受益比例<br>順位</th>
                      <th class="has-text-centered">特殊分類<br>信託銀行代號</th>
                      <th class="has-text-centered">分期型態<br>給付方式</th>
                      <th class="has-text-centered">分期期間<br>分期給付比例</th>
                      <th class="has-text-centered">備註</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(bene, index) in beneList"
                      :key="'beneList' + index"
                    >
                      <td class="has-text-centered">{{ index + 1 }}</td>
                      <td class="has-text-centered">{{ bene.BENE_TYPE_SHOW }}</td>
                      <td class="has-text-centered">{{ bene.BENE_ID }}<br>{{ bene.BENE_NAME }}</td>
                      <td class="has-text-centered">{{ bene.NATION_CODE }}<br>{{ bene.RLTN_SHOW }}</td>
                      <td class="has-text-centered">{{ getROCDate(bene.BIRTHDAY) }}<br>{{ bene.IS_CIVIL_LAW }}</td>
                      <td class="has-text-centered">{{ bene.BENE_RATO }}<br>{{ bene.BENE_PRIO }}</td>
                      <td class="has-text-centered">{{ bene.SPEC_CAT_SHOW }}<br>{{ bene.TRST_BANK }}</td>
                      <td class="has-text-centered">{{ bene.SPR_TYPE_SHOW }}<br>{{ bene.SPR_KIND }}</td>
                      <td class="has-text-centered">{{ bene.SPR_PERIOD }}<br>{{ bene.SPR_RATO }}</td>
                      <td class="has-text-centered">{{ bene.BENE_MEMO }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="second-card">
            <span class="sticky-basic-info"></span>
            <!-- Data List -->
            <div class="card is-full">
              <div class="table-content">
                <div class="table-title">
                  <span style="font-weight: 600">附約受益人</span>
                </div>
                <table class="table is-striped-odd hover-none is-fullwidth" v-if="!isEmpty(rdBeneList)">
                  <thead>
                    <tr>
                      <th class="has-text-centered">序號</th>
                      <th class="has-text-centered">受益人類別</th>
                      <th class="has-text-centered">險別<br>被保人ID</th>
                      <th class="has-text-centered">證件號碼<br>受益人姓名</th>
                      <th class="has-text-centered">國籍<br>關係</th>
                      <th class="has-text-centered">出生日期<br>依民法</th>
                      <th class="has-text-centered">受益比例<br>順位</th>
                      <th class="has-text-centered">特殊分類<br>信託銀行代號</th>
                      <th class="has-text-centered">分期型態<br>給付方式</th>
                      <th class="has-text-centered">分期期間<br>分期給付比例</th>
                      <th class="has-text-centered">備註</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(bene, index) in rdBeneList"
                      :key="'rdBeneList' + index"
                    >
                      <td class="has-text-centered">{{ index + 1 }}</td>
                      <td class="has-text-centered">{{ bene.BENE_TYPE_SHOW }}</td>
                      <td class="has-text-centered">{{ bene.RD_ID }}<br>{{ bene.ID }}</td>
                      <td class="has-text-centered">{{ bene.BENE_ID }}<br>{{ bene.BENE_NAME }}</td>
                      <td class="has-text-centered">{{ bene.NATION_CODE }}<br>{{ bene.RLTN_SHOW }}</td>
                      <td class="has-text-centered">{{ getROCDate(bene.BIRTHDAY) }}<br>{{ bene.IS_CIVIL_LAW }}</td>
                      <td class="has-text-centered">{{ bene.BENE_RATO }}<br>{{ bene.BENE_PRIO }}</td>
                      <td class="has-text-centered">{{ bene.SPEC_CAT_SHOW }}<br>{{ bene.TRST_BANK }}</td>
                      <td class="has-text-centered">{{ bene.SPR_TYPE_SHOW }}<br>{{ bene.SPR_KIND }}</td>
                      <td class="has-text-centered">{{ bene.SPR_PERIOD }}<br>{{ bene.SPR_RATO }}</td>
                      <td class="has-text-centered">{{ bene.BENE_MEMO }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="third-card">
            <span class="sticky-basic-info"></span>
            <!-- Data List -->
            <div class="card is-full">
              <div class="table-content">
                <div class="table-title">
                  <span style="font-weight: 600">受益人變更歷程</span>
                </div>
                <table class="table is-striped-odd hover-none is-fullwidth" v-if="!isEmpty(beneModifyList)">
                  <thead>
                    <tr>
                      <th class="has-text-centered">序號</th>
                      <th class="has-text-centered">險別<br>被保人ID</th>
                      <th class="has-text-centered">受理編號<br>受益人種類</th>
                      <th class="has-text-centered">受益人序號<br>與被保人關係</th>
                      <th class="has-text-centered">證件號碼<br>受益人姓名</th>
                      <th class="has-text-centered">依民法<br>國籍</th>
                      <th class="has-text-centered">出生日期<br>信託銀行代號</th>
                      <th class="has-text-centered">受益比例<br>順位</th>
                      <th class="has-text-centered">特殊分類<br>分期型態</th>
                      <th class="has-text-centered">受理日期<br>作業方式</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(bene, index) in beneModifyList"
                      :key="'beneModifyList' + index"
                    >
                      <td class="has-text-centered">{{ index + 1 }}</td>
                      <td class="has-text-centered">{{ bene.RD_ID }}<br>{{ bene.ID }}</td>
                      <td class="has-text-centered">{{ bene.APLY_NO }}<br>{{ bene.BENE_TYPE_SHOW }}</td>
                      <td class="has-text-centered">{{ bene.BENE_SER }}<br>{{ bene.RLTN_SHOW }}</td>
                      <td class="has-text-centered">{{ bene.BENE_ID }}<br>{{ bene.BENE_NAME }}</td>
                      <td class="has-text-centered">{{ bene.IS_CIVIL_LAW }}<br>{{ bene.NATION_CODE }}</td>
                      <td class="has-text-centered">{{ getROCDate(bene.BIRTHDAY) }}<br>{{ bene.TRST_BANK }}</td>
                      <td class="has-text-centered">{{ bene.BENE_RATO }}<br>{{ bene.BENE_PRIO }}</td>
                      <td class="has-text-centered">{{ bene.SPEC_CAT_SHOW }}<br>{{ bene.SPR_TYPE_SHOW }}</td>
                      <td class="has-text-centered">{{ getROCDate(bene.APLY_DATE) }}<br>{{ bene.OPR_IND }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="button-scroll-to-top" style="left: 50%">回到頂部</div>
      </section>
    </main>
  </div>
</template>

<script setup>
  import initialUI from '~/common/ui/initial';
  import initMasterUI from '../../common/ui/master';
  import { useBeneficiaryStore } from '~/stores/beneficiary';
  import useMoment from '~/composables/useMoment.js';
  import { isEmpty } from 'lodash-es';
  import useSwal from '~/composables/useSwal';

  const beneficiaryStore = useBeneficiaryStore();
  const route = useRoute();
  const { $swal } = useSwal();
  const { getROCDate } = useMoment();

  onActivated(() => {
    initialUI();
    initMasterUI();
  });

  const beneList = ref({});
  const rdBeneList = ref([]);
  const beneModifyList = ref([]);

  // 查詢的受理編號
  const policyNo = route.query?.q;
  const result = await beneficiaryStore.getPolicyBeneList(policyNo);
  if (!result.IS_SUCCESS) throw result.RTN_MSG;

  if ((result.BENE_LIST.length === 0) && (result.RD_BENE_LIST.length === 0) && (result.BENE_MODIFY_LIST.length === 0)) {
    $swal.warning('查無受益人資料。');
  }

  beneList.value = result.BENE_LIST;
  rdBeneList.value = result.RD_BENE_LIST;
  beneModifyList.value = result.BENE_MODIFY_LIST;
</script>

<style lang="scss">
</style>
