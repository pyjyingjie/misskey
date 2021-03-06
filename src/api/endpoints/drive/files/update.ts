/**
 * Module dependencies
 */
import $ from 'cafy';
import DriveFolder from '../../../models/drive-folder';
import DriveFile from '../../../models/drive-file';
import { validateFileName } from '../../../models/drive-file';
import serialize from '../../../serializers/drive-file';
import event from '../../../event';

/**
 * Update a file
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
	// Get 'file_id' parameter
	const [fileId, fileIdErr] = $(params.file_id).id().$;
	if (fileIdErr) return rej('invalid file_id param');

	// Fetch file
	const file = await DriveFile
		.findOne({
			_id: fileId,
			user_id: user._id
		}, {
			fields: {
				data: false
			}
		});

	if (file === null) {
		return rej('file-not-found');
	}

	// Get 'name' parameter
	const [name, nameErr] = $(params.name).optional.string().pipe(validateFileName).$;
	if (nameErr) return rej('invalid name param');
	if (name) file.name = name;

	// Get 'folder_id' parameter
	const [folderId, folderIdErr] = $(params.folder_id).optional.nullable.id().$;
	if (folderIdErr) return rej('invalid folder_id param');

	if (folderId !== undefined) {
		if (folderId === null) {
			file.folder_id = null;
		} else {
			// Fetch folder
			const folder = await DriveFolder
				.findOne({
					_id: folderId,
					user_id: user._id
				});

			if (folder === null) {
				return rej('folder-not-found');
			}

			file.folder_id = folder._id;
		}
	}

	DriveFile.update(file._id, {
		$set: {
			name: file.name,
			folder_id: file.folder_id
		}
	});

	// Serialize
	const fileObj = await serialize(file);

	// Response
	res(fileObj);

	// Publish drive_file_updated event
	event(user._id, 'drive_file_updated', fileObj);
});
