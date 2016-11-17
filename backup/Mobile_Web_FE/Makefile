# 示例：
# make dev desc=重构代码
export desc
server:
	edp webserver start
dev:
	sh ci.sh feature-toApp $(desc)
bugfixed:
	sh ci.sh bugfixed-hanrui-commonshare $(desc)
test:
	sh ci.sh test $(desc)
m-test:
	sh ci.sh m-test $(desc)
qa:
	sh ci.sh qa_0630 $(desc)
release:
	sh ci.sh release_20160728 $(desc)
master:
	sh ci.sh master $(desc)


.PHONY: dev bugfixed test m-test beta master qa hanrui server
