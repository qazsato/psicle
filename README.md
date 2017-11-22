# PSICLE

Page Speed Insightsを複数URL同時実行するCLIツールです。

![psicle](https://raw.githubusercontent.com/wiki/qazsato/psicle/psicle.png)

## How to use

1. リポジトリをクローンして、node_modulesをインストールする

```
$ git clone https://github.com/qazsato/psicle.git
$ cd psicle
$ npm install
```

2. ./data/input.csvに計測したいURLを記述する

```
url
https://example.com/
https://example.co.jp/
```

3. 下記コマンドを実行するとPage Speed Insightsの実行結果が./data/output.csvに出力されます

```
$ npm run psicle
```

## LICENCE

MIT
