import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/useAuth'
import {
  assignSocietySectionMember,
  createSocietySection,
  followSociety,
  getSociety,
  getSocietyPosts,
  joinSociety,
  leaveSociety,
  postToSociety,
  unfollowSociety,
  updateSociety,
} from '../../api/societies'
import { getPrivilegeLabel, getPrivilegeLevel } from '../../utils/societyPrivileges'
import PostCard from '../../components/PostCard'

const SocietyDetail = () => {
  const { identifier } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const currentUserId = useMemo(() => {
    const token = user?.token || localStorage.getItem('token')
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1])).userId || null
    } catch {
      return null
    }
  }, [user])

  const [society, setSociety] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPicture, setEditPicture] = useState('')
  const [pictureFile, setPictureFile] = useState(null)
  const [savingSociety, setSavingSociety] = useState(false)
  const [sectionName, setSectionName] = useState('')
  const [sectionDescription, setSectionDescription] = useState('')
  const [creatingSection, setCreatingSection] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [postSectionId, setPostSectionId] = useState('')
  const [posting, setPosting] = useState(false)
  const [assignSectionUserId, setAssignSectionUserId] = useState('')
  const [assignSectionSectionId, setAssignSectionSectionId] = useState('')
  const [assigningMember, setAssigningMember] = useState(false)

  const loadDetail = useCallback(async (sectionId = '', silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError('')
      const [detail, postList] = await Promise.all([
        getSociety(identifier),
        getSocietyPosts(identifier, sectionId || undefined),
      ])

      setSociety(detail)
      setPosts(Array.isArray(postList) ? postList : [])
      setSelectedSectionId(sectionId)
      setEditName(detail?.society?.name || '')
      setEditDescription(detail?.society?.description || '')
      setEditPicture(detail?.society?.picture || '')
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load society')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [identifier])

  useEffect(() => {
    loadDetail('')
  }, [loadDetail])

  const membership = society?.membership
  const privilegeLevel = getPrivilegeLevel(membership)
  const isInvited = membership?.status === 'invited'
  const isMember = membership?.status === 'active'
  const isFollowing = Boolean(society?.isFollowing)
  const canManageSociety = ['creator', 'admin'].includes(privilegeLevel) || Boolean(membership?.permissions?.manageSociety || membership?.permissions?.editSociety)
  const canCreateSocietyPosts = isMember && ['creator', 'admin', 'moderator'].includes(privilegeLevel)
  const canJoinSociety = Boolean(!society?.society?.settings?.inviteOnly && !isMember && !isInvited)
  const canAcceptInvite = Boolean(isInvited)
  const canLeaveSociety = Boolean(isMember)

  const handleJoin = async () => {
    try {
      setBusyAction('join')
      await joinSociety(identifier)
      await loadDetail(selectedSectionId, true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Action failed')
    } finally {
      setBusyAction('')
    }
  }

  const handleFollow = async () => {
    try {
      setBusyAction('follow')
      await (isFollowing ? unfollowSociety(identifier) : followSociety(identifier))
      await loadDetail(selectedSectionId, true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Action failed')
    } finally {
      setBusyAction('')
    }
  }

  const handleLeave = async () => {
    try {
      setBusyAction('leave')
      await leaveSociety(identifier)
      await loadDetail('', true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Action failed')
    } finally {
      setBusyAction('')
    }
  }

  const handleSaveSociety = async (event) => {
    event.preventDefault()
    if (!society?.society) return

    try {
      setSavingSociety(true)
      setError('')
      const formData = new FormData()
      formData.append('name', editName)
      formData.append('description', editDescription)
      formData.append('picture', editPicture)
      if (pictureFile) formData.append('pictureFile', pictureFile)

      await updateSociety(identifier, formData)
      await loadDetail(selectedSectionId, true)
      setEditing(false)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save society')
    } finally {
      setSavingSociety(false)
    }
  }

  const handleCreateSection = async (event) => {
    event.preventDefault()
    if (!sectionName.trim()) return

    try {
      setCreatingSection(true)
      setError('')
      await createSocietySection(identifier, {
        name: sectionName.trim(),
        description: sectionDescription.trim(),
        order: society?.society?.sections?.length || 0,
      })
      setSectionName('')
      setSectionDescription('')
      await loadDetail(selectedSectionId, true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create section')
    } finally {
      setCreatingSection(false)
    }
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()
    if (!postContent.trim() || !society?.society?._id) return

    try {
      setPosting(true)
      setError('')
      await postToSociety({
        content: postContent.trim(),
        societyId: society.society._id,
        sectionId: postSectionId || undefined,
      })
      setPostContent('')
      setPostSectionId('')
      await loadDetail(selectedSectionId, true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  const handleAssignMemberToSection = async (event) => {
    event.preventDefault()
    if (!assignSectionUserId || !assignSectionSectionId) return

    try {
      setAssigningMember(true)
      setError('')
      await assignSocietySectionMember(identifier, assignSectionSectionId, { userId: assignSectionUserId })
      setAssignSectionUserId('')
      setAssignSectionSectionId('')
      await loadDetail(selectedSectionId, true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to assign member')
    } finally {
      setAssigningMember(false)
    }
  }

  const sections = society?.society?.sections || []
  const members = society?.society?.members || []

  const s = {
    page: {
      minHeight: '100vh',
      background: '#eef3e2',
      backgroundImage: 'linear-gradient(#c8d8a0 1px, transparent 1px), linear-gradient(90deg, #c8d8a0 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      fontFamily: "'Nunito', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    },
    body: { flex: 1, padding: '80px 20px 48px' },
    shell: { maxWidth: 980, margin: '0 auto', width: '100%' },
    footer: { textAlign: 'center', padding: 18, fontSize: '0.82rem', color: '#2e7d32', fontWeight: 700 },
    card: { background: '#f9faf4', borderRadius: 20, border: '2.5px solid #1a4a1a', borderTop: '7px solid #43a047', boxShadow: '0 4px 18px rgba(0,0,0,0.09)', padding: '24px 28px', marginBottom: 20 },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
    sectionTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: '1.1rem', color: '#1a4a1a', margin: 0 },
    badge: { display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: '#d4e6a5', border: '1.5px solid #1a4a1a', fontWeight: 700, fontSize: '0.78rem', color: '#1a4a1a' },
    badgeAccent: { background: '#fff3cd', border: '1.5px solid #e6a817', color: '#7a4a00' },
    heroBrand: { display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' },
    heroInfo: { flex: 1, minWidth: 0 },
    kicker: { margin: '0 0 6px', color: '#5a7a3a', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 },
    heroName: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: '1.9rem', color: '#1a4a1a', margin: '0 0 6px' },
    heroDesc: { color: '#4a6a2a', fontSize: '0.92rem', margin: '0 0 12px', lineHeight: 1.6 },
    badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
    heroActions: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 },
    statsRow: { display: 'flex', gap: 0, borderTop: '1.5px solid #dce8c0', marginTop: 20, paddingTop: 16, flexWrap: 'wrap' },
    statNum: { display: 'block', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: '1.5rem', color: '#1a4a1a' },
    statLabel: { fontSize: '0.78rem', color: '#5a7a3a', fontWeight: 700 },
    sectionBtn: { width: '100%', textAlign: 'left', padding: '12px 14px', marginBottom: 8, borderRadius: 12, border: '2px solid #dce8c0', background: '#f0f7f0', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s', display: 'block' },
    sectionBtnActive: { border: '2px solid #1a4a1a', background: '#d4e6a5' },
    sectionBtnName: { fontWeight: 700, fontSize: '0.9rem', color: '#1a4a1a', display: 'block' },
    sectionBtnDesc: { fontSize: '0.8rem', color: '#5a7a3a', marginTop: 2, display: 'block' },
    memberRow: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid #eef3e2', flexWrap: 'wrap' },
    memberName: { fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a', margin: 0 },
    memberSub: { fontSize: '0.78rem', color: '#5a7a3a', margin: '2px 0 0' },
    postCard: { borderRadius: 14, border: '2px solid #dce8c0', background: '#fff', padding: '14px 18px', marginBottom: 12 },
    postMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8, flexWrap: 'wrap' },
    postSocName: { fontWeight: 800, fontSize: '0.9rem', color: '#1a4a1a', margin: 0 },
    postBy: { fontSize: '0.8rem', color: '#5a7a3a', margin: '2px 0 0' },
    postTag: { fontSize: '0.75rem', fontWeight: 700, color: '#5a7a3a', background: '#eef3e2', borderRadius: 8, padding: '3px 10px', whiteSpace: 'nowrap' },
    postContent: { fontSize: '0.9rem', color: '#222', lineHeight: 1.6, margin: 0 },
    fieldWrap: { marginBottom: 14 },
    label: { display: 'block', fontWeight: 700, fontSize: '0.83rem', color: '#1a1a1a', marginBottom: 5 },
    input: { width: '100%', padding: '10px 13px', boxSizing: 'border-box', border: '2px solid #43a047', borderRadius: 10, background: '#f0f7f0', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif", color: '#111', outline: 'none' },
    textarea: { width: '100%', padding: '10px 13px', boxSizing: 'border-box', border: '2px solid #43a047', borderRadius: 10, background: '#f0f7f0', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif", color: '#111', outline: 'none', resize: 'vertical', lineHeight: 1.6 },
    select: { width: '100%', padding: '10px 13px', boxSizing: 'border-box', border: '2px solid #43a047', borderRadius: 10, background: '#f0f7f0', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif", color: '#111', outline: 'none', cursor: 'pointer' },
    errorBox: { background: '#ffeef0', border: '1.5px solid #f48fb1', borderRadius: 10, padding: '10px 14px', color: '#c62828', fontSize: '0.85rem', fontWeight: 700, marginBottom: 16 },
    emptyText: { color: '#5a7a3a', fontSize: '0.88rem', fontStyle: 'italic', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 },
  }

  const buttonStyle = (extra = {}) => ({
    padding: '8px 18px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: '0.85rem',
    border: '2px solid #1a4a1a',
    background: 'none',
    color: '#1a4a1a',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    ...extra,
  })

  return (
    <div style={s.page}>
      <Navbar
        links={[
          { to: '/feed', label: 'Feed' },
          { to: '/create-post', label: 'Create Post' },
          { to: '/societies', label: 'Societies' },
          { to: '/explore', label: 'Explore' },
          { to: '/messages', label: 'Messages' },
          { to: '/settings', label: 'Settings' },
          { to: '/about', label: 'About' },
          { to: '/contact', label: 'Contact' },
        ]}
      />

      <main style={s.body} className="container-lg">
        <div style={s.shell}>
          {loading && <div className="alert alert-info text-center fw-semibold">Loading society…</div>}
          {error && <div style={s.errorBox}>⚠ {error}</div>}

          {!loading && society && (
            <div className="d-grid gap-4">
              <div style={s.card}>
                <div style={s.heroBrand}>
                  <Avatar src={society.society?.picture} name={society.society?.name} size={72} />
                  <div style={s.heroInfo}>
                    <p style={s.kicker}>{society.society?.visibility} society</p>
                    <h1 style={s.heroName}>{society.society?.name}</h1>
                    <p style={s.heroDesc}>{society.society?.description || 'No description yet.'}</p>
                    <div style={s.badgeRow}>
                      <span style={s.badge}>{society.society?.visibility}</span>
                      {society.society?.settings?.inviteOnly && <span style={{ ...s.badge, ...s.badgeAccent }}>invite only</span>}
                      {isInvited && <span style={{ ...s.badge, ...s.badgeAccent }}>invited</span>}
                    </div>
                    <div style={s.heroActions}>
                      {canManageSociety && (
                        <Link to={`/societies/${society.society?.slug || society.society?._id}/manage`} className="btn btn-outline-success rounded-pill">
                          Manage People
                        </Link>
                      )}
                      {(canJoinSociety || canAcceptInvite) && (
                        <button type="button" style={{ ...buttonStyle(), background: '#1a4a1a', color: '#fff', border: 'none' }} onClick={handleJoin} disabled={busyAction === 'join' || isMember}>
                          {busyAction === 'join' ? 'Joining…' : (canAcceptInvite ? 'Accept Invite' : 'Join')}
                        </button>
                      )}
                      <button type="button" style={buttonStyle(isFollowing ? { background: '#e8f5e0' } : {})} onClick={handleFollow} disabled={busyAction === 'follow'}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                      {canLeaveSociety && (
                        <button type="button" style={buttonStyle({ borderColor: '#c62828', color: '#c62828' })} onClick={handleLeave} disabled={busyAction === 'leave'}>
                          {busyAction === 'leave' ? 'Leaving…' : 'Leave'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div style={s.statsRow}>
                  {[
                    { num: society.memberCount, label: 'Members' },
                    { num: society.followerCount, label: 'Followers' },
                    { num: society.sectionCount, label: 'Sections' },
                    { num: society.postCount, label: 'Posts' },
                  ].map((item, index, list) => (
                    <div key={item.label} style={{ flex: 1, minWidth: 120, textAlign: 'center', borderRight: index === list.length - 1 ? 'none' : '1.5px solid #dce8c0' }}>
                      <span style={s.statNum}>{item.num ?? 0}</span>
                      <span style={s.statLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {canCreateSocietyPosts && (
                <div style={s.card}>
                  <div style={s.panelHeader}>
                    <h2 style={s.sectionTitle}>Write a Post</h2>
                    <span style={s.badge}>Instant</span>
                  </div>
                  <form onSubmit={handleCreatePost}>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Content</label>
                      <textarea style={s.textarea} rows={4} placeholder="Share an update with the society…" value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                    </div>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Section</label>
                      <select style={s.select} value={postSectionId} onChange={(e) => setPostSectionId(e.target.value)}>
                        <option value="">General</option>
                        {sections.map((section) => <option key={section._id} value={section._id}>{section.name}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-success rounded-pill" disabled={posting || !postContent.trim()}>
                      {posting ? 'Posting…' : 'Post to Society'}
                    </button>
                  </form>
                </div>
              )}

              <div style={s.grid} className="sd-grid">
                <div style={s.card}>
                  <div style={s.panelHeader}>
                    <h2 style={s.sectionTitle}>Sections</h2>
                    <span style={s.badge}>{sections.length} total</span>
                  </div>
                  {sections.length === 0 ? (
                    <p style={s.emptyText}>No sections yet.</p>
                  ) : (
                    sections.map((section) => (
                      <button
                        key={section._id}
                        type="button"
                        className="sd-secBtn"
                        style={{ ...s.sectionBtn, ...(selectedSectionId === section._id ? s.sectionBtnActive : {}) }}
                        onClick={() => loadDetail(section._id)}
                      >
                        <span style={s.sectionBtnName}>{section.name}</span>
                        <span style={s.sectionBtnDesc}>{section.description || 'No description.'}</span>
                      </button>
                    ))
                  )}
                </div>

                <div style={s.card}>
                  <div style={s.panelHeader}>
                    <h2 style={s.sectionTitle}>Members</h2>
                    <span style={s.badge}>{members.length} total</span>
                  </div>
                  {members.length === 0 ? (
                    <p style={s.emptyText}>No members loaded.</p>
                  ) : (
                    members.map((member) => (
                      <div key={member._id} style={s.memberRow}>
                        <Avatar src={member.userId?.avatar} name={member.userId?.name || member.userId?.username} size={40} />
                        <div style={{ minWidth: 0 }}>
                          <p style={s.memberName}>{member.userId?.name || member.userId?.username || 'Member'}</p>
                          <p style={s.memberSub}>@{member.userId?.username} · {getPrivilegeLabel(member)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ ...s.card, padding: '24px 0 0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div style={{ ...s.panelHeader, padding: '0 12px' }}>
                  <h2 style={s.sectionTitle}>Recent Posts</h2>
                  <span style={s.badge}>{posts.length} posts</span>
                </div>
                {posts.length === 0 ? (
                  <p style={{ ...s.emptyText, padding: '0 12px' }}>No posts yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-3 mt-3">
                    {posts.map((post) => (
                      <PostCard 
                        key={post._id} 
                        post={post} 
                        currentUserId={currentUserId} 
                        onDelete={() => loadDetail(selectedSectionId, true)} 
                        onUpdate={() => loadDetail(selectedSectionId, true)} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {canManageSociety && (
                <div style={s.card}>
                  <div style={s.panelHeader}>
                    <h2 style={s.sectionTitle}>Manage Society</h2>
                    <span style={s.badge}>Admin tools</span>
                  </div>
                  <form onSubmit={handleSaveSociety} className="d-grid gap-3">
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Name</label>
                      <input style={s.input} value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Description</label>
                      <textarea style={s.textarea} rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    </div>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Picture URL</label>
                      <input style={s.input} placeholder="https://…" value={editPicture} onChange={(e) => setEditPicture(e.target.value)} />
                    </div>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Upload Picture</label>
                      <input type="file" accept="image/*" className="form-control" onChange={(e) => setPictureFile(e.target.files?.[0] || null)} />
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <button type="submit" className="btn btn-success rounded-pill" disabled={savingSociety}>{savingSociety ? 'Saving…' : 'Save Society'}</button>
                      <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setEditing((value) => !value)}>{editing ? 'Close Editor' : 'Edit Details'}</button>
                    </div>
                  </form>
                  <form onSubmit={handleCreateSection} className="mt-4 d-grid gap-3">
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Section Name</label>
                      <input style={s.input} value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
                    </div>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Section Description</label>
                      <textarea style={s.textarea} rows={2} value={sectionDescription} onChange={(e) => setSectionDescription(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-outline-success rounded-pill" disabled={creatingSection}>{creatingSection ? 'Creating…' : 'Create Section'}</button>
                  </form>
                  <form onSubmit={handleAssignMemberToSection} className="mt-4 d-grid gap-3">
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Member</label>
                      <select style={s.select} value={assignSectionUserId} onChange={(e) => setAssignSectionUserId(e.target.value)}>
                        <option value="">Select member</option>
                        {members.map((member) => (
                          <option key={member._id} value={member.userId?._id}>{member.userId?.name || member.userId?.username}</option>
                        ))}
                      </select>
                    </div>
                    <div style={s.fieldWrap}>
                      <label style={s.label}>Section</label>
                      <select style={s.select} value={assignSectionSectionId} onChange={(e) => setAssignSectionSectionId(e.target.value)}>
                        <option value="">Select section</option>
                        {sections.map((section) => (
                          <option key={section._id} value={section._id}>{section.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-outline-success rounded-pill" disabled={assigningMember}>{assigningMember ? 'Assigning…' : 'Assign to Section'}</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer style={s.footer}>✦ UNIVERSE — made with ♥ ✦</footer>
    </div>
  )
}

export default SocietyDetail