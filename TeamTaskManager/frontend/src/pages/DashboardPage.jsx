import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyTaskForm = {
  project_id: '',
  title: '',
  description: '',
  assigned_to: '',
  due_date: ''
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ totalTasks: 0, completedTasks: 0, overdueTasks: 0 });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [memberIds, setMemberIds] = useState('');
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isAdmin = user?.role === 'admin';

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [dashboardData, projectData, taskData] = await Promise.all([
        api.dashboard(),
        api.projects.list(),
        api.tasks.list()
      ]);
      setSummary(dashboardData.summary);
      setProjects(projectData.projects);
      setTasks(taskData.tasks);
      if (!taskForm.project_id && projectData.projects[0]) {
        setTaskForm((current) => ({ ...current, project_id: String(projectData.projects[0].id) }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const taskCompletionRatio = useMemo(() => {
    if (!summary.totalTasks) {
      return 0;
    }
    return Math.round((summary.completedTasks / summary.totalTasks) * 100);
  }, [summary]);

  async function handleCreateProject(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await api.projects.create({ name: projectName });
      setProjectName('');
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setBusy(false);
    }
  }

  async function handleAddMembers(projectId) {
    const ids = memberIds
      .split(',')
      .map((value) => Number(value.trim()))
      .filter(Boolean);

    if (!ids.length) {
      setError('Enter one or more numeric user IDs');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await api.projects.addMembers(projectId, { user_ids: ids });
      setMemberIds('');
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(err.message || 'Failed to add members');
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      await api.tasks.create({
        project_id: Number(taskForm.project_id),
        title: taskForm.title,
        description: taskForm.description,
        assigned_to: taskForm.assigned_to ? Number(taskForm.assigned_to) : undefined,
        due_date: taskForm.due_date || null
      });
      setTaskForm(emptyTaskForm);
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      await api.tasks.updateStatus(taskId, { status });
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  }

  if (loading) {
    return <div className="page-shell center-stage">Loading your workspace...</div>;
  }

  return (
    <div className="workspace">
      <aside className="sidebar panel">
        <div>
          <span className="eyebrow">Signed in as</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="role-pill">{user.role}</div>
        <button className="button button-ghost" onClick={logout}>Sign out</button>
      </aside>

      <main className="content">
        <header className="hero panel">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Team progress at a glance</h1>
            <p>Track project delivery, assignments, and overdue work without leaving this screen.</p>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>{taskCompletionRatio}%</strong>
              <span>completion</span>
            </div>
            <div>
              <strong>{projects.length}</strong>
              <span>projects</span>
            </div>
            <div>
              <strong>{tasks.length}</strong>
              <span>tasks</span>
            </div>
          </div>
        </header>

        {error ? <div className="notice notice-error">{error}</div> : null}

        <section className="stats-grid">
          <article className="stat-card panel">
            <span>Total tasks</span>
            <strong>{summary.totalTasks}</strong>
          </article>
          <article className="stat-card panel">
            <span>Completed</span>
            <strong>{summary.completedTasks}</strong>
          </article>
          <article className="stat-card panel">
            <span>Overdue</span>
            <strong>{summary.overdueTasks}</strong>
          </article>
        </section>

        <section className="panel chart-panel">
          <div className="section-head">
            <h3>Status snapshot</h3>
            <span>Simple progress bars, no heavy charting library.</span>
          </div>
          <div className="bar-row">
            <span>Completed</span>
            <div className="bar-track"><div className="bar-fill bar-fill-success" style={{ width: `${summary.totalTasks ? (summary.completedTasks / summary.totalTasks) * 100 : 0}%` }} /></div>
            <strong>{summary.completedTasks}</strong>
          </div>
          <div className="bar-row">
            <span>Overdue</span>
            <div className="bar-track"><div className="bar-fill bar-fill-danger" style={{ width: `${summary.totalTasks ? (summary.overdueTasks / summary.totalTasks) * 100 : 0}%` }} /></div>
            <strong>{summary.overdueTasks}</strong>
          </div>
        </section>

        <section className="grid-two">
          <div className="panel section-card">
            <div className="section-head">
              <h3>Projects</h3>
              <span>{isAdmin ? 'Admin tools enabled' : 'Read-only view for members'}</span>
            </div>

            {isAdmin ? (
              <form className="stack compact" onSubmit={handleCreateProject}>
                <label>
                  <span>Create project</span>
                  <input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="New launch" />
                </label>
                <button className="button button-primary" type="submit" disabled={busy}>Add project</button>
              </form>
            ) : null}

            <div className="project-list">
              {projects.map((project) => (
                <article key={project.id} className="mini-card">
                  <div className="mini-card-head">
                    <div>
                      <h4>{project.name}</h4>
                      <p>{project.members.length} team members</p>
                    </div>
                    <span className="chip">#{project.id}</span>
                  </div>
                  <div className="chip-row">
                    {project.members.map((member) => (
                      <span key={member.id} className="chip muted">{member.name}</span>
                    ))}
                  </div>
                  {isAdmin ? (
                    <div className="inline-form">
                      <input
                        placeholder="Member IDs, comma separated"
                        value={memberIds}
                        onChange={(event) => setMemberIds(event.target.value)}
                      />
                      <button className="button button-secondary" onClick={() => handleAddMembers(project.id)} type="button" disabled={busy}>
                        Add members
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="panel section-card">
            <div className="section-head">
              <h3>Tasks</h3>
              <span>{isAdmin ? 'Create and assign work' : 'Update your assigned tasks'}</span>
            </div>

            {isAdmin ? (
              <form className="stack compact" onSubmit={handleCreateTask}>
                <label>
                  <span>Project</span>
                  <select value={taskForm.project_id} onChange={(event) => setTaskForm((current) => ({ ...current, project_id: event.target.value }))}>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Title</span>
                  <input value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} placeholder="Prepare launch notes" />
                </label>
                <label>
                  <span>Description</span>
                  <textarea value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} rows="3" placeholder="Keep it short and clear" />
                </label>
                <label>
                  <span>Assign to user ID</span>
                  <input value={taskForm.assigned_to} onChange={(event) => setTaskForm((current) => ({ ...current, assigned_to: event.target.value }))} placeholder="2" />
                </label>
                <label>
                  <span>Due date</span>
                  <input type="date" value={taskForm.due_date} onChange={(event) => setTaskForm((current) => ({ ...current, due_date: event.target.value }))} />
                </label>
                <button className="button button-primary" type="submit" disabled={busy}>Create task</button>
              </form>
            ) : null}

            <div className="task-list">
              {tasks.map((task) => (
                <article key={task.id} className="task-card">
                  <div className="mini-card-head">
                    <div>
                      <h4>{task.title}</h4>
                      <p>{task.project_name} · {task.assigned_name || 'Unassigned'}</p>
                    </div>
                    <span className={`status status-${task.status.toLowerCase()}`}>{task.status}</span>
                  </div>
                  <p className="muted-text">{task.description}</p>
                  <div className="task-footer">
                    <span>Due {task.due_date || 'no date'}</span>
                    <select value={task.status} onChange={(event) => handleStatusChange(task.id, event.target.value)}>
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
