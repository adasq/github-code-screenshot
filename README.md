# github-code-screenshot
Produce image based on github source code

### INPUT:
https://github.com/adasq/github-code-screenshot/blob/158f56eaac74c02879cf434a58add69dab2c7b98/src/screen-producer.js#L15-L39

### OUTPUT:
![screenshot of a source code](https://github.com/adasq/github-code-screenshot/blob/master/images/example.png)


## Use it online

https://github-shot.herokuapp.com/

## How to install?

### 1. Clone repo
```sh
$ git clone git@github.com:adasq/github-code-screenshot.git
$ cd github-code-screenshot
```

### 2. Install dependencies

```
$ npm install
```

### 3. Run server

```
$ npm start
```
or using github username and token:

```
$ USER=... TOKEN=... npm start
```

(The service uses Github API in order to fetch source code details. Using Github Auth you can make up to 5000 requests. More here: https://developer.github.com/v3/#rate-limiting)

### 4. Visit http://localhost:3000


### 5. update carbon service

1. wget -r --no-parent https://carbon.now.sh/
2. replace all "/_next/ with "/carbon/_next/
3. replace all "/static/ with "/carbon/static/ 