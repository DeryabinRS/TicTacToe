class User{

	state = {
		user: {},
	}

	constructor(idEl = '#app'){
		this.app = document.querySelector(idEl);
		this.id = localStorage.getItem('user');
		if(this.id){

		}else{
			//this.createAuthRegBtns();
		}
	}

	createForm(id, classes = [], content){
		this.app.innerHTML = '';
		const form = document.createElement('div');
		form.setAttribute('id', id);
		form.classList.add(...classes);
		form.innerHTML = content;
		this.app.append(form);
		return form;
	}

	createUserBtnsForm(){
		const form = this.createForm(
			"auth_panel",
			["pt-2"],
			`<button type="button" id="sign_in" class="btn btn-primary">Sign in</button> 
			 <button type="button" id="sign_up" class="btn btn-warning">Sign up</button>`
		);
		return form;
	}

	createAuthForm(){
		const contentForm = `
			<div class="mb-3">
				<label for="email" class="form-label">Email address</label>
				<input type="email" class="form-control" id="email">
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input type="password" class="form-control" id="password">
			</div>
			<button type="button" id="auth_user" class="btn btn-primary">Login</button>
		`;
		const form = this.createForm("auth_form", ["card", "px-2", "py-2", "mt-2"], contentForm);
		return form;
	}

	createRegForm(){
		const contentForm = `
			<div class="mb-3">
				<label for="exampleInputEmail1" class="form-label">Email address</label>
				<input type="email" class="form-control" id="email">
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input type="password" class="form-control" id="password">
			</div>
			<div class="mb-3">
				<label for="password_cfm" class="form-label">Confirm password</label>
				<input type="password" class="form-control" id="password_cfm">
			</div>
			<button type="button" class="btn btn-primary">Registration</button>
		`;
    	const form = this.createForm("reg_form", ["card", "px-2", "py-2", "mt-2"], contentForm);
		return form;
	}

	createEventElForm(id, event, funcEvent){
		const el = document.querySelector(id);
		el.addEventListener(event, funcEvent);
	}

	async getUsers(e) {
		const res = await fetch('./db.json')
		const users = await res.json()
		console.log(users)
	}
}

