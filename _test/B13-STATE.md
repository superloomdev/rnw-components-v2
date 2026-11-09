# Batch 13 progress (wip/batch-m5-13)
- item0 ComboBox onPressIn/onPressOut + test, check x2 green
- Popover+PopoverContent: folder + api/spec/sample/reference + notes + all.js + roster; check x2 green; 3 fire rows FIRE
- TODO: DefinitionTooltip (tooltip family), Toggletip+4 members (Link.inverse, Button.focusRingLeaf), TagSet,
  roster descriptions for remaining rows, docs/catalog regen, focused runs, closing batch

## Resumption facts (batch 13)
- Branch `wip/batch-m5-13` from `4eda7a8` (batch-12 commit, NOT bcbc37a).
- Watches: shell 7ce77c = library CI run 40257364829 (bcbc37a) -> ci-watch.log; shell ed2848 = native gate 40257387447 -> watch.log; ev dir `__dev__/evidence/0160/m5/s1-native-3/`.
- After gate exits: jobs.tsv (`gh run view 40257387447 --repo superloomdev/demo-client-rnw-v2 --json jobs --jq '.jobs[]|[.name,.conclusion]|@tsv'` > jobs.tsv), `gh run download -D ev`, failed-<job>.log per failed job, `grep -o "FAIL .*" | sort -u` per job.
- Popover folder pattern: `component/molecule/popover/` has popover.js (caller-owned `open`, useAnchoredPosition{anchor,placement,offset:off+caretH/2,track,flip:autoAlign===true}, useEscapeKey+useOverlay onClose=onRequestClose, bubble=Registry.PopoverContent w/ composition {align:resolved placement,caret,border,dropShadow,highContrast,layerStyle}), popover-content.js (fill popover_container|tooltip_container, border popover_border 1px when border&&!hc, shadow.popover when dropShadow&&!hc, maxWidth, radius, caret() copied from tooltip.js, defaults: caret!==false draws, align 'bottom').
- Upstream defaults (census raws): DefTooltip align='bottom' openOnHover=false, trigger aria-expanded/controls/describedby, closes blur/Escape/leave, bubble = Popover highContrast no-shadow caret, pad def_tooltip_padding_block/inline, max def_tooltip_max_width, type body_01, term = body text_primary + 1px dotted underline definition_term_underline(_hover on hover/focus), border.width_01.
- Toggletip: Popover caret highContrast no-shadow offset control.toggletip_offset(13); Escape refocuses button; Label=type.label_01+text_secondary+spacing_03 gap; Button=icon 'information' size.icon_01 color toggletip_icon/_active(hover|open)+ctx.focusRing; Content=body01+spacing_05 pad+max control.toggletip_max_width inverse cells; Actions=row space-between spacing_05, kind 'link'->Link(inverse comp prop: link_label_inverse/_hover+focus_ring_inverse ring),'button'->small Button(focusRingLeaf:'focus_ring_inverse' comp prop); api.composition additions on Link+Button; defaults unchanged.
- TagSet (tag family): props tags[{label,type?,onClose?}] align(start|center|end) multiline maxVisible overflowType(default|tag) showAllTagsLabel allTagsModalTitle allTagsModalSearchLabel; gap control.tag_set_gap(8) marginEnd+Bottom; onLayout measure container+each tag, fit count most-that-fit beside overflow tag capped maxVisible; +n OperationalTag -> Popover(highContrast) listing hidden tags as body_compact_01 rows spacing_05 pad; >10 hidden -> Link inverse 'View all tags' -> Modal(title)+Search(label) filters tags case-insensitive; samples FRAME{width:320}: fits/overflow/max-visible/multiline/many/dismissible; reference kind render-web mounts ibm-products TagSet (harness loads its CSS).
- Roster descriptions = lead's verbatim text in brief item 5.
- Purity: samples must NOT pass composition props; REQUIRED_TOKENS in contract.js = union(spec tokens + api.tokens) per component const + join() line ~306; tests live in _test/[stem].test.js; RNW expands borderRadius->borderTopLeftRadius etc in DOM styles.
- Skill workflow rnw-component.md phases C+D per row; check -- <Name> x2 + fire --only per row; focused playwright --grep per touched row; closing `npm run batch` ONCE when focused green -> __dev__/evidence/0160/m5/batch-13/batch.log; sheets Popover/Tooltip/Tag.png -> sheets-b13/; defects.js; evidence.js; git diff 4eda7a8 > batch-13/b13.diff. COMMIT NOTHING.

## Progress (checkpoint)
- Popover + PopoverContent: DONE (check x2 green, 3 fire rows fire)
- DefinitionTooltip: files written (definition-tooltip.js, api/spec/sample/reference.definition-tooltip.js, _test/definition-tooltip.test.js 3/3 standalone green); contract.js updated w/ DEFINITION_TOOLTIP_REQUIRED; `check -- DefinitionTooltip` FAILS on purity + tests + a11y-identity  -  diagnose next.
- Fire rows pending: definition-underline-hover, definition-max-width (added to fixture, not yet fired)
- Remaining: Toggletip+4 members (needs Link.inverse + Button.focusRingLeaf composition props), TagSet, roster descriptions (brief item 5 verbatim), docs/catalog regen, focused playwright runs, closing batch
- Watches: shell 7ce77c = lib CI 40257364829 -> s1-native-3/ci-watch.log; shell ed2848 = gate 40257387447 -> watch.log

## checkpoint 2
- DefinitionTooltip: files + contract.js + 3-test file + reference done; check -- DefinitionTooltip x1 confirmed passed (second run in-flight output truncated). Fire rows re-run pending.
- Fire-test lesson: maxWidth observed via find(el.style.maxWidth===176px) INSIDE pressed-open bubble; 't' shadowed -> renamed tt.
- Next: re-run the 2 def fire rows, then Toggletip family (toggletip.js + label/button/content/actions + api/spec/sample/reference.[stem].js + _test), Link.inverse + Button.focusRingLeaf composition props, TagSet, roster descriptions verbatim, docs/catalog regen, focused playwright, closing batch.
