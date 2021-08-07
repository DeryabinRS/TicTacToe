class User {
    constructor(idEl = "#app") {
        this.app = document.querySelector(idEl);
        this.id = localStorage.getItem("user");
        if (this.id) {
        } else {
          //this.createAuthRegBtns();
        }
    }

    createForm(id, classes = [], content) {
        this.app.innerHTML = "";
        const form = document.createElement("div");
        form.setAttribute("id", id);
        form.classList.add(...classes);
        form.innerHTML = content;
        this.app.append(form);
        return form;
    }

    createUserBtnsForm() {
        const form = this.createForm(
            "auth_panel",
            ["pt-2"],
            `<!--<button type="button" id="sign_in" class="btn btn-primary">Sign in</button>-->
            <button type="button" id="sign_up" class="btn btn-warning">Sign up</button>`
        );
        return form;
    }

    //Для реальной БД
    createAuthForm() {
        const contentForm = `
          <form>
          <div class="mb-3">
            <label for="login" class="form-label">Login</label>
            <input type="text" class="form-control" id="login">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password">
          </div>
          <button type="button" id="btn_auth" class="btn btn-primary">Login</button>
          </form>
        `;
        const form = this.createForm("auth_form", ["card", "px-2", "py-2", "mt-2"],contentForm);
        return form;
    }

    createRegForm() {
        const contentForm = `
            <form>
            <div class="mb-3">
              <label for="login" class="form-label">Login</label>
              <input type="text" class="form-control" id="login">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password">
            </div>
            <div class="mb-3">
              <label for="password_cfm" class="form-label">Confirm password</label>
              <input type="password" class="form-control" id="password_cfm">
            </div>
            <button type="button" id="btn_reg" class="btn btn-primary">Registration</button>
            </form>
        `;
        const form = this.createForm("reg_form", ["card", "px-2", "py-2", "mt-2"], contentForm);
        return form;
    }

    createUserAccount(userLs) {
        const currentGame = localStorage.getItem('current_game');
        let contentForm = `
            <div>
              <label for="login" class="form-label">User name</label>
              <input type="text" class="form-control" id="login" value="${userLs.login}" readonly>
              <button id="logout" class="btn btn-danger mt-2">Logout</button>
            </div>
        `;
        
        if(currentGame){
            contentForm += `<hr><div><button id="continue_game" class="btn btn-info">Continue current game</button></div>`;
        }
        contentForm += '<hr>' + this.createHistoryBlock();

        const form = this.createForm("reg_form", ["card", "px-2", "py-2", "mt-2"], contentForm);
        return form;
    }
    createHistoryBlock(){
        const history = JSON.parse(localStorage.getItem('history_game'));
        let contentForm = '';
        if(history){
            contentForm += `<h4>History of games</h4><table class="table">
              <thead><tr><th>Date</th><th>Status</th></tr></thead>
            `;
            history.forEach( h => {
                contentForm += `<tr><td>${h.data}</td><td>${h.info}</td></tr>`
            })
            contentForm += '</table>';
        }else{
            contentForm += `<div class="alert alert-warning mt-2">You have no history of games</div>`
        }
        return contentForm;
    }

    createEventElForm(id, event, funcEvent) {
        const el = document.querySelector(id);
        el.addEventListener(event, funcEvent);
    }

    createMsgBox(el, classes = [], msg) {
        el.innerHTML = `<div class="${classes.join(" ")}">${msg}</div>`;
    }

    getUser(login) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            if (user.login === login) return true;
        }
        return false;
    }

    registrationUser(user = {}) {
      if (user.login === "") return { res: 0, message: "Enter login" };
      if (user.password === "") return { res: 0, message: "Enter password" };
      if (user.password !== user.password_cfm)
        return { res: 0, message: "Password mismatch" };

      const checkUser = this.getUser(user.login);
      if (!checkUser) {
        const newUser = {
          login: user.login,
          password: user.password,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        return { res: 1, message: 'User is registered! <a href="./game.html">Play Game -></a>' };
      } else {
        return { res: 0, message: "User already exists" };
      }
    }

    Logout(){
        localStorage.clear();
        window.location = './index.html'
    }
}

