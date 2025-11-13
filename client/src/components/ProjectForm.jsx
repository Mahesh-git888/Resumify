import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ProjectForm = ({ data, onChange }) => {
  // ➕ Add new project
  const addProject = () => {
    const newProject = {
      name: '',
      type: '',
      description: '',
    };
    onChange([...data, newProject]);
  };

  // ❌ Remove a project
  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // ✏️ Update specific field
  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your projects</p>
        </div>
        <button
          onClick={addProject}
          type="button"
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          <p>No projects added yet.</p>
          <p>Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {data.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              {/* Title + Delete */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">
                  Project #{index + 1}
                </h4>
                <button
                  onClick={() => removeProject(index)}
                  type="button"
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Inputs Grid */}
              <div className="grid gap-3">
                <input
                  value={project.name || ''}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  type="text"
                  placeholder="Project Name"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                <input
                  value={project.type || ''}
                  onChange={(e) => updateProject(index, 'type', e.target.value)}
                  type="text"
                  placeholder="Project Type (e.g., Web App, IoT, ML Model)"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Description */}
              <textarea
                rows={4}
                value={project.description || ''}
                onChange={(e) =>
                  updateProject(index, 'description', e.target.value)
                }
                placeholder="Describe your project..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
