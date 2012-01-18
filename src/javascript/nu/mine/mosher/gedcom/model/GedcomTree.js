/*
 * @licstart  The following is the entire license notice for the JavaScript code in this page.
 *
 * Copyright (C) 2012, by Christopher Alan Mosher, Shelton, CT.
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice for the JavaScript code in this page.
 */

/**
 * @fileoverview
 * Defines the {@link GedcomTree} class.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"nu/mine/mosher/util/Util",
	"nu/mine/mosher/util/TreeNode",
	"./GedcomLine"],
function(
	declare,
	lang,
	Util,
	TreeNode,
	GedcomLine) {

	"use strict";

	var GedcomTree = declare(null, {

		/**
		 * @class Represents a GEDCOM file, as a hierarchical tree.
		 * @requires GedcomLine
		 * @requires TreeNode
		 * @requires Util
		 *
		 * @constructor
		 * @return new {@link GedcomTree}
		 * @type GedcomTreee
		 */
		constructor: function() {
			/**
			 * The root of the entire tree. We add a "line" property to each {@link TreeNode} for its {@link GedcomLine}.
			 * @private
			 * @type TreeNode
			 */
			this.root = new TreeNode();

			/**
			 * previously added node
			 * @private
			 * @type TreeNode
			 */
			this.prevNode = this.root;

			/**
			 * level number of previously added node
			 * @private
			 * @type Number
			 */
			this.prevLevel = -1;
		},

		/**
		 * Gets the root, which is a {@link TreeNode}. Each {@link TreeNode} will
		 * have a property called "line" that is a {@link GedcomLine}. The children of
		 * the returned {@link TreeNode} will be the top-level (level number zero)
		 * records in the GEDCOM file.
		 * @return root {@link TreeNode} with {@link GedcomLine} <code>line</code> property
		 * @type TreeNode
		 */
		getRoot: function() {
			return this.root;
		},

		/**
		 * Adds the given line to this {@link GedcomTree}. Note that this method must
		 * be called in the same sequence as lines in the GEDCOM file.
		 * @param {GedcomLine} line the line to append
		 */
		appendLine: function(line) {
			var c, i, v, p;
			if (!(line instanceof GedcomLine)) {
				throw new TypeError("must be GedcomLine");
			}

			v = line.getLevel();
			c = this.prevLevel + 1 - v;
			if (c < 0) {
				throw new Error("Invalid level: " + v);
			}
			this.prevLevel = v;

			p = this.prevNode;
			for (i = 0; i < c; i++) {
				p = p.getParent();
			}

			this.prevNode = new TreeNode();
			this.prevNode.line = line; // create "line" property in tree node
			p.addChild(this.prevNode);
		},

		/**
		 * Concatenates any CONC or CONT lines in this {@link GedcomTree}
		 * to their parent lines, and removes the CONC and CONT lines.
		 */
		concatenate: function() {
			GedcomTree.concatenatePrivateHelper(this.getRoot());
		},

		resolveReferences: function() {
			GedcomTree.resolveReferencesPrivateHelper(this.getRoot());
		},

		/**
		 * Parses the given GEDCOM string and adds the records
		 * to this {@link GedcomTree}. Can be called multiple times for chunks of
		 * the input GEDCOM file, but must be called in order.
		 * @param {String} gc entire GEDCOM file
		 */
		parseAppend: function(gc) {
			var rs = Util.getLines(gc);

			rs.forEach(lang.hitch(this,function(s) {
				if (s.length > 0) { // skip blank lines
					// parse the line and add it to this tree
					this.appendLine(GedcomLine.parse(s));
				}
			}));
		}
	});

	/**
	 * Creates a {@link GedcomTree} by parsing the
	 * given GEDCOM string. The GEDCOM must be complete.
	 * @param {String} gc entire GEDCOM file
	 * @return new {@link GedcomTree} representing the given file gc
	 * @type GedcomTree
	 */
	GedcomTree.parse = function(gc) {
		var g = new GedcomTree();
		g.parseAppend(gc);
		g.concatenate();
		g.resolveReferences();
		return g;
	};

	/**
	 * Helper method for concatenate.
	 * @private
	 * @param {TreeNode} p root of tree to process
	 */
	GedcomTree.concatenatePrivateHelper = function(p) {
		var rdel = [];

		p.getChildren().forEach(function(c) {
			GedcomTree.concatenatePrivateHelper(c);
			switch (c.line.getTag()) {
				case "CONT":
				case "CONC":
					p.line.concat(c.line);
					rdel.push(c);
			}
		});
		rdel.forEach(function(c) {
			c.removeFromParent();
		});
	};

	GedcomTree.resolveReferencesPrivateHelper = function(p) {
		var mapIdToNode = {};

		// go thru top-level lines, with IDs, and put them into a map
		p.getChildren().forEach(function(node) {
			// don't need to recurse, because only top-level
			// lines have IDs
			if (node.line.hasID()) {
				mapIdToNode[node.line.getID()] = node;
			}
		});

		// now recurse thru all nodes and resolve ID references
		GedcomTree.resolveReferencesResolverPrivateHelper(mapIdToNode,p);
	};

	GedcomTree.resolveReferencesResolverPrivateHelper = function(map,p) {
		p.getChildren().forEach(function(node) {
			GedcomTree.resolveReferencesResolverPrivateHelper(map,node);
			if (node.line.isPointer()) {
				node.line.setRef(map[node.line.getPointer()]);
			}
		});
	};

	return GedcomTree;

});
