import { supabase } from '../supabase/client'

const TABLE = 'documents'
const BUCKET = 'documents'

export async function getDocuments({ candidateId, documentType } = {}) {
  let query = supabase.from(TABLE).select('*')
  if (candidateId) query = query.eq('candidate_id', candidateId)
  if (documentType) query = query.eq('document_type', documentType)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadDocument(file, candidateId, documentType) {
  const filePath = `${candidateId}/${Date.now()}_${file.name}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file)
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

  const { data, error } = await supabase.from(TABLE).insert({
    candidate_id: candidateId,
    document_type: documentType,
    file_name: file.name,
    file_path: filePath,
    file_url: urlData.publicUrl,
    file_size: file.size,
    mime_type: file.type,
  }).select().single()
  if (error) throw error
  return data
}

export async function deleteDocument(id, filePath) {
  if (filePath) {
    await supabase.storage.from(BUCKET).remove([filePath])
  }
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

export async function downloadDocument(filePath, fileName) {
  const { data, error } = await supabase.storage.from(BUCKET).download(filePath)
  if (error) throw error
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}
