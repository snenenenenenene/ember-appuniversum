import Component from '@glimmer/component';

export default class AuBadgeComponent extends Component {
  get skin() {
    if (this.args.skin == "info")
      return "au-c-badge--info";
    if (this.args.skin == "action")
      return "au-c-badge--action";
    if (this.args.skin == "success")
      return "au-c-badge--success";
    if (this.args.skin == "warning")
      return "au-c-badge--warning";
    if (this.args.skin == "error")
      return "au-c-badge--error";
    return "";
  }
}
