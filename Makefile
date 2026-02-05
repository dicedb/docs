DICEDB_ROOT     ?= /home/arpit/workspace/dicedb/dice3
VALKEY_DOC_ROOT ?= /home/arpit/workspace/dicedb/valkey-doc

ifeq ("$(wildcard $(DICEDB_ROOT))","")
  $(error DICEDB_ROOT must point to the DiceDB source code)
endif

.PHONY: generate

generate:
# 	cp -f $(VALKEY_DOC_ROOT)/commands/*.md content/commands/
	python3 utils/add-frontmatter.py frontmatter --dicedb-root $(DICEDB_ROOT) content/commands/*.md
	python3 utils/add-frontmatter.py valkey-index --dicedb-root $(DICEDB_ROOT) --output content/docs/commands/valkey.mdx
