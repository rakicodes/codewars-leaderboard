import { hundredDevs } from "./leonClan.js";

function MakeLeaderboard(hundredDevs) {
    this.users = [];
    this.urls = [];
    this.jsUsers = [];
    this.hundredDevs = hundredDevs;
    this.sortBy = 'honor';

    this.sortByHonor = function() {
        this.users.sort( (a,b) => b.honor-a.honor)
    }.bind(this);

    this.sortByJS = function() {
        this.jsUsers.sort( (a,b) => b.ranks.languages.javascript.score - a.ranks.languages.javascript.score );
    }.bind(this);

    this.sortUsers = function(e) {
        this.resetBoard();
        this.resetSearchResults();

        if (e.target.id === 'button-honor') {
            this.sortBy = 'honor';
            this.sortByHonor();
            this.displayUsers(this.users.length);
            document.querySelector('#button-honor').classList.add("active");
            document.querySelector('#button-js').classList.remove("active");
            document.querySelector('#result-image').src = './images/swords.png'
        }

        if (e.target.id === 'button-js') {
            this.sortBy = 'js';
            this.sortByJS();
            this.displayUsers(this.jsUsers.length);
            document.querySelector('#button-js').classList.add("active");
            document.querySelector('#button-honor').classList.remove("active");
            document.querySelector('#result-image').src = './images/js.png'
        }

    }.bind(this);

    this.getUsers = async function() {
        try {
            const data = await Promise.all(this.urls.map(url => fetch(url)));
            const ext = await Promise.all(data.map(res => res.json()));
            for (let item of ext) {
              this.users.push(item);
              if ("javascript" in item.ranks.languages) {
                this.jsUsers.push(item);
              }
            }
          } catch (err) {
            console.log(err);
          }
    }.bind(this);

    this.getUrls = function() {
        for (let i=0; i<this.hundredDevs.length; i++) {
            this.urls.push(`https://www.codewars.com/api/v1/users/${this.hundredDevs[i].user}`);
        }
    }.bind(this);

    this.displayUser = function(index) {
        let tbody = document.querySelector("tbody");
        let rank = index+1;
        let name = this.sortBy === 'honor' ? this.users[index].username : this.jsUsers[index].username;
        let score = this.sortBy === 'honor' ? this.users[index].honor : this.jsUsers[index].ranks.languages.javascript.score;

        let tr = document.createElement('tr');
        tr.className = 'user';
        let tdRank = tr.appendChild(document.createElement('td'));
        tdRank.className = 'rank';
        tdRank.innerHTML = rank;
        let tdName = tr.appendChild(document.createElement('td'));
        tdName.className = 'name';
        tdName.innerHTML = name;
        let tdImg = tr.appendChild(document.createElement('td'));
        tdImg.className = 'td-image';
        tdImg.innerHTML = this.sortBy === 'honor' ?  `<img src="./images/swords.png" alt="points logo">`:  `<img src="./images/js.png" alt="points logo">`;
        let tdScore = tr.appendChild(document.createElement('td'));
        tdScore.className = 'score';
        tdScore.innerHTML = score;
        tbody.appendChild(tr);
    }

    this.displayUsers =  function(length = hundredDevs.length) {
        for (let i=0; i<length; i++) {
            this.displayUser(i);
         }
    }

    this.searchName = function(e) {
        let name = document.querySelector('#search-value').value;
        document.querySelector('#search-value').value = "";
        let index = this.sortBy === 'honor' ? this.users.findIndex(user => user.username === name) : this.jsUsers.findIndex(user => user.username === name);

        if (index === -1) {
            document.querySelector('.searchName').innerText = 'No users found.';
            document.querySelector('.searchRank').innerText = '---';
            document.querySelector('.searchScore').innerText = '---';

        } else {
            document.querySelector('.searchName').innerText = this.sortBy === 'honor' ? this.users[index].username : this.jsUsers[index].username;
            document.querySelector('.searchRank').innerText = index+1;
            document.querySelector('.searchScore').innerText = this.sortBy === 'honor' ? this.users[index].honor : this.jsUsers[index].ranks.languages.javascript.score;
        }

    }.bind(this);

    this.displayLeaderBoard = function() {
        document.querySelector('.lds-container').classList.remove('loading');
        document.querySelector('.lds-container').classList.add('hidden');
        document.querySelector('#leaderboard').classList.remove('hidden');
        document.querySelector('#leaderboard-container').classList.remove('isLoading');
        document.querySelector('#leaderboard').classList.add('displayTable');
        document.querySelector('#loadingBlock').classList.remove('darken');
    }

    this.resetSearchResults = function() {
        document.querySelector('.searchName').innerText = '---';
        document.querySelector('.searchRank').innerText = '---';
        document.querySelector('.searchScore').innerText = '---';
    };

    this.resetBoard = function() {
        document.querySelector('tbody').innerHTML = "";
    }

}

async function setUp() {
    let leaderboard =  new MakeLeaderboard(hundredDevs);
    leaderboard.getUrls();
    await leaderboard.getUsers();
    leaderboard.sortByHonor();
    leaderboard.displayUsers();
    leaderboard.displayLeaderBoard();

    console.log(leaderboard)

    document.querySelector('#button-honor').addEventListener('click', leaderboard.sortUsers);
    document.querySelector('#button-js').addEventListener('click', leaderboard.sortUsers);
    document.querySelector('#button-search').addEventListener('click', leaderboard.searchName);
    document.addEventListener('keydown', e => {
        if (e.code === "Enter") {
            leaderboard.searchName();
        }
    });


}


setUp();