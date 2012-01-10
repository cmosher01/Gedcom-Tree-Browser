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
 * Defines the {@link TreeNode} class.
 */

/**
 * @class Represents a node and the tree rooted at it.
 * @requires Util
 * @constructor
 * @return new {@link TreeNode}
 * @type TreeNode
 */

define(["dojo/_base/declare"], null, function(declare) {

	"use strict";

	return declare(null, {

		constructor: function() {
			/**
			 * parent node, or null if this is the root
			 * @private
			 * @type TreeNode
			 */
			this.parent = null;

			/**
			 * children nodes
			 * @private
			 * @type Array
			 */
			this.children = [];
		},

		/**
		 * Gets the direct child {@link TreeNode}s of this {@link TreeNode}.
		 * @return child {@link TreeNode}s
		 * @type Array
		 */
		getChildren: function() {
			return this.children;
		},

		/**
		 * Gets the direct parent {@link TreeNode} of this {@link TreeNode}.
		 * Returns <code>null</code> if this is the root node.
		 * @returns parent {@link TreeNode}
		 * @type TreeNode
		 */
		getParent: function() {
			return this.parent;
		},

		/**
		 * Remove the given child {@link TreeNode} from this {@link TreeNode}.
		 * If the given node is not a child of this node, then this method does
		 * not alter this node.
		 * Note that the given child will be a root node (with no parent) after
		 * this method returns (whether or not the removal takes place).
		 * @param {TreeNode} child the child to remove
		 * @throws if the given child is not a {@link TreeNode}
		 */
		removeChild: function(child) {
			child.parent = null;
			this.children.filter(function (c) { return c !== child; });
		},

		/**
		 * Removes this {@link TreeNode} from its parent, if it has one.
		 */
		removeFromParent: function() {
			if (this.parent) {
				this.parent.removeChild(this);
			}
		},

		/**
		 * Appends the given {@link TreeNode} as a child of this {@link TreeNode}.
		 * @param {TreeNode} child the child to append
		 * @throws if the given child is not a {@link TreeNode}
		 */
		addChild: function(child) {
			child.removeFromParent();
			this.children.push(child);
			child.parent = this;
		}
	});

});
