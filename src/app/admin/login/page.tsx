import Link from "next/link";import {LoginForm} from "./login-form";
export default function Login(){return <main className="shell login"><section className="card"><Link className="brand" href="/">Spondon<small>Operations</small></Link><h1 style={{marginTop:32}}>Welcome back</h1><p className="muted">Sign in to manage registrations and banner operations.</p><LoginForm/></section></main>}
