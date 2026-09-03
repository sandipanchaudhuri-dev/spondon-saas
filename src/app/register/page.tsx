import {PublicFooter,PublicHeader} from "@/components/public-brand-shell";
import {RegistrationForm} from "./registration-form";

export default function RegisterPage(){return <main className="shell"><PublicHeader/><div className="form-wrap"><header className="form-head"><div className="eyebrow">Sharod Samman 2026</div><h1>Pujo registration</h1><p className="lead">Tell us about your Pujo committee. It takes about four minutes.</p></header><RegistrationForm/></div><PublicFooter/></main>}
