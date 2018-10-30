<script>
import Vue from "vue";
import "./index.less";
// import veeValidate from "vee-validate";
// import FormItem from "../components/FormItem";
import Header from "../components/Header";
import Confirm from "@/components/confirm";
import { Toast } from "mint-ui";
import VCForm from "@/components/Form/index.vue";
import service from "@/service/protocol";
import { mapActions, mapGetters, mapState } from "vuex";
export default Vue.component("protocol-detail", {
  data() {
    return {
      hiddenField: {},
      disabled: true,
      meta: "",
      isConfirmShow: false,
      list: [
        {
          type: "labelItem",
          label: "装企信息",
          customClass: "first-label-item-custon-class"
        },
        {
          type: "text",
          name: "company_name",
          label: "装企业全称",
          validate: "required"
        },
        {
          type: "text",
          name: "company_legal_person",
          label: "法定代表人",
          validate: "required"
        },
        {
          type: "text",
          name: "contact_person",
          label: "联系人",
          validate: "required"
        },
        {
          type: "text",
          name: "company_address",
          label: "联系地址",
          validate: "required"
        },
        {
          type: "text",
          name: "company_phone",
          label: "联系方式",
          validate: "required|telephoneNumber"
        },
        {
          type: "email",
          name: "company_mail",
          label: "电子邮件",
          validate: "required"
        },
        {
          type: "labelItem",
          label: "装修合同信息",
          customClass: "label-item-custon-class"
        },
        {
          type: "text",
          name: "contract_no",
          label: "合同编号",
          validate: "required"
        },
        {
          type: "date",
          name: "sign_time",
          label: "签约时间",
          validate: "required"
        },
        {
          type: "text",
          name: "tenement_address",
          label: "物业地址",
          validate: "required"
        },
        {
          type: "number",
          name: "decorate_area",
          label: "装修面积",
          validate: "required|positiveNumber",
          step: "0.01",
          suffix: <span class="m2-suffix">㎡</span>
        },
        {
          type: "houseType",
          name: [
            "bed_room_num",
            "living_room_num",
            "bath_room_num",
            "kitchen_num"
          ],
          label: "装修户型",
          validate: "required"
        },
        {
          type: "radioItem",
          name: "decorate_method",
          label: "装修方式",
          validate: "required",
          chooseItem: [
            { text: "整装", value: 1 },
            { text: "局装", value: 2 },
            { text: "其他", value: 3 }
          ]
        },
        {
          type: "radioItem",
          name: "decorate_form",
          label: "装修形式",
          chooseItem: [
            { text: "全包", value: 1 },
            { text: "半包", value: 2 },
            { text: "清包", value: 3 }
          ],
          validate: "required"
        },
        {
          type: "date",
          name: "work_time",
          label: "开工日期"
        },
        {
          type: "date",
          name: "finish_time",
          label: "竣工日期"
        },
        {
          type: "number",
          name: "project_period",
          label: "工程期限",
          validate: "required|min_value:0|positiveNumber",
          suffix: <span class="m2-suffix">天</span>
        },
        {
          type: "number",
          name: "project_price",
          label: "工程价款",
          validate: "required|min_value:0|positiveNumber",
          step: "0.01",
          suffix: <span class="m2-suffix">万</span>
        }
      ]
    };
  },
  props: {},
  methods: {
    ...mapActions(["setProtocolStatus"]),
    ...mapGetters(["getProtocolStatus"]),
    submit(e) {
      this.$refs["protocol-form"].getValue().then(data => {
        if (!data) {
          return;
        }
        let protocolStatus = this.getProtocolStatus();
        data = { ...data, ...protocolStatus };
        if (!!data) {
          service
            .submitProtocol(data)
            .then(res => {
              if (!res.errno) {
                if (!res.data.result.instance_id) {
                  Toast("系统错误");
                }
                this.setProtocolStatus({
                  instance_id: res.data.result.instance_id
                });
                this.$router.push({
                  path: "/protocol/preview",
                  query: {
                    meta: "z_preview"
                  }
                });
              } else {
                Toast(res.error);
              }
            })
            .catch(err => {
              Toast(err);
            });
        }
      });
    },
    save() {
      if (this.disabled) return;
      let data = this.$refs["protocol-form"].getValueWithoutValidate();
      let protocolStatus = this.getProtocolStatus();
      delete protocolStatus.instance_id;
      data = { ...data, ...protocolStatus };
      service
        .saveProtocol(data)
        .then(res => {
          if (!res.errno) {
            Toast("保存成功");
          } else {
            Toast(res.error);
          }
        })
        .catch(err => {
          if (err.error) {
            Toast(err.error);
          } else {
            Toast("网络错误");
          }
        });
      // switch (this.meta) {
      //   case "update":
      //     break;
      //   case "save":
      //     service
      //       .saveProtocol(data)
      //       .then(res => {
      //         if (!res.errno) {
      //           Toast("保存成功");
      //         } else {
      //           Toast(res.error);
      //         }
      //       })
      //       .catch(err => {
      //         if (err.error) {
      //           Toast(err.error);
      //         } else {
      //           Toast("网络错误");
      //         }
      //       });
      //     break;
      //   default:
      //     break;
      // }
    },
    onFieldChange() {
      this.disabled = false;
    },
    initFormValue(fileds) {
      this.$refs["protocol-form"].setFieldsValue(fileds);
    },
    /* 
      获取协议字段内容
    */
    getProtocolDetail(agreement_code) {
      service
        .getProtocolDetail({
          agreement_code
        })
        .then(res => {
          if (!res.errno) {
            this.initFormValue(res.data);
          } else {
            Toast(res.error);
          }
        })
        .catch(err => {
          if (err.error) {
            Toast(err.error);
          } else {
            Toast("网络错误");
          }
        });
    },
    // initHiddenField(hiddenField) {
    //   this.hiddenField = hiddenField;
    // },
    init() {
      //创建 保存 修改
      this.meta = this.$route.query.meta;
      let protocolStatus = this.getProtocolStatus();
      if (protocolStatus.agreement_code) {
        this.getProtocolDetail(protocolStatus.agreement_code);
      }
    },
    onGoBack() {
      this.isConfirmShow = true;
    },
    onOk() {
      this.isConfirmShow = false;
      //从商机页来，不能直接go(-1)，这样那边有bug
      if (this.meta === "save") {
        this.$router.push("/business/wait_sign");
      } else {
        this.$router.go(-1);
      }
    },
    onCancel() {
      this.isConfirmShow = false;
    }
  },
  updated() {},
  mounted() {
    this.init();
  },
  render() {
    return (
      <div>
        <transition name="fade">
          {this.isConfirmShow && (
            <Confirm
              msg="确定返回吗？"
              onSure={this.onOk}
              onCancel={this.onCancel}
            />
          )}
        </transition>
        <Header
          title={this.meta === "update" ? "修改协议" : "创建协议"}
          onGoBack={this.onGoBack}
          style={{ position: "fixed", top: '37.5px', left: 0, right: 0, zIndex: 2 }}
        >
          <div slot="buttons">
            <span
              class={this.disabled ? "save-button-disabled" : "save-button"}
              onClick={this.save}
            >
              保存
            </span>
          </div>
        </Header>
        <div class="gutter" />
        <div class="detail-content">
          {
            <VCForm
              list={this.list}
              hiddenField={this.hiddenField}
              ref="protocol-form"
              onFieldChange={this.onFieldChange}
            >
              <div slot="button-container" class="button-container">
                <div class="protocol-submit" onClick={this.submit}>
                  提交
                </div>
              </div>
            </VCForm>
          }
        </div>
      </div>
    );
  }
});
</script>
